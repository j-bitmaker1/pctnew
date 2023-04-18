import { mapState } from 'vuex';
import PDFTools from "@/application/shared/utils/pdftools";
import PDFReports from "@/application/lib/pct/pdfreports";

import moment from 'moment'
import _ from 'underscore';
import f from '@/application/shared/functions.js'
var pdfMake = require('pdfmake/build/pdfmake.js');
var pdfFonts = require('pdfmake/build/vfs_fonts.js');

pdfMake.vfs = pdfFonts.pdfMake.vfs;

import settingsPdf from '@/components/modules/app/settings/pdf/index.vue'


export default {
    name: 'portfolio_createpdf',
    props: {
        id: Number
    },
    components: {
        settingsPdf
    },
    data: function () {

        return {
            loading: true,
            portfolio: null,
            profile: null,
            values: {},
            reports: [],
            progress: 0,
            making: false,
            optimized : null,
            rollover : null
        }

    },

    created() {
        this.load()
        this.init()
    },

    beforeDestroy(){
        
	},

    watch: {
        portfolio : function(){
            if(this.optimizationOnScreen){

                if(this.optimizationOnScreen.portfolio == this.id){
                    this.optimized = this.optimizationOnScreen

                    this.rolloverFromOptimized()
                }

                

            }
            else{
                this.core.getsettings("OPTIMIZATION_RESULT", this.id).then(s => {
                    this.optimized = s
                })
            }
        },

        comparePortfolios : function(){
            this.initreports()

            setTimeout(() => {
                this.$refs['reports'].reset()
            }, 30)
        }
        //$route: 'getdata'
    },
    computed: mapState({
        auth: state => state.auth,
        valuemode : state => state.valuemode,
        optimizationOnScreen : state => state.optimizationOnScreen,
        comparePortfolios : function(){
            return _.toArray(this.rollover ? this.rollover.portfolios : {})
        } 
    }),


    methods: {
        changeReports: function (v) {
            this.values = v


            this.core.settings.lspdf.set('reports', this.values)
        },
        init: function () {

            this.core.initpdfreports(PDFReports)

            this.initreports()

        },

        initreports : function(){
            
            var values = {}

            var f = _.filter(this.core.pdfreports.meta, (r) => {
                return !r.require
            })

            this.core.settings.lspdf.getall()

            var sreports = (this.core.settings.lspdf.get('reports') || {}).value || {}

            this.reports = _.map(f, (report) => {

                var disabled = false

                if(report.disableCompare && this.comparePortfolios.length) {
                    disabled = true
                }

                values[report.key] = disabled ? false : (typeof sreports[report.key] != 'undefined' ? sreports[report.key] : report.default)

                return {
                    id: report.key,
                    input: 'checkbox',
                    disabled,
                    text: 'pdfreports.reports.' + report.key,

                    rules: [{
                        rule: 'required'
                    }]
                }
            })

            this.values = values

            console.log("this.values", this.values)
        },

        load: function () {
            this.loading = true

            return this.core.settings.pdf.getall().then(() => {
                return this.core.api.pctapi.portfolios.get(this.id)
            }).then(r => {

                this.portfolio = r

                this.core.activity.template('portfoliopdf', this.portfolio)

                if (!r.crmContactId) {
                    return Promise.resolve()
                }

                return this.core.api.crm.contacts.gets({ Ids: [r.crmContactId] }).then(c => {
                    this.profile = c[0]
                })

            }).finally(() => {
                this.loading = false
            })
        },

        getrollover : function(){
            
        },

        make: function () {

            moment.locale(this.$i18n.locale)

            this.making = true

            var comparePortfolios = this.comparePortfolios

            var nameOfReport = "Portfolio Crash Testing Report" + (comparePortfolios.length ? "" : (": " + this.portfolio.name))
            var saveName = 'RiXtrema - Portfolio Crash Testing Report as of ' + moment().format('MMMM/DD/YYYY');

            this.core.settings.pdf.getall().then(settings => {

                var logotype = settings.logotype.value || settings.logotype.default

                if(!logotype){
                    var hc = ''

                    if(window.location.pathname.indexOf('pctnew') > -1 ) hc = '/pctnew'

                    return f.srcToData(window.location.origin + hc + '/img/pdflogo.jfif')
                }
                
                return Promise.resolve(logotype)

            }).then((logotype) => {

                var pdftools = new PDFTools({
                    logo: logotype
                }, {
                    rollover : this.rollover ? this.rollover.portfolio : null,
                    comparePortfolios : comparePortfolios,
                    portfolio: this.portfolio,
                    profile: this.profile,
                    locale: this.$i18n.locale,
                    disclosure: this.core.settings.pdf.get('disclosure').value,
                    valuemode : this.valuemode,
                    meta: {
                        pageSize: 'A4',
                        sizeOfLogo: 1,

                        reportName: nameOfReport,
                        titleColor: "#333",

                        headers: {
                            first: nameOfReport,
                            second: 'Date of creation: ' + moment(new Date()).local().format("LL"),
                        },

                        pageFooter: 'See Important Disclosure Information section in this report for explanations of methodologies, assumptions and limitations.'

                    }

                })

                var keys = []

                _.each(this.values, (v, i) => {
                    if (v) keys.push(i)
                })

                return pdftools.prepare().then(tools => {

                    return this.core.pdfreports.make(keys, tools, {

                        progress: (percent) => {
                            this.progress = percent
                        }

                    })

                })

            }).then(tools => {

                var d = pdfMake.createPdf(tools.doc);

                return Promise.resolve(d)

            }).then(d => {

                return new Promise((resolve, reject) => {

                    if(f.isios()){
                        d.download(saveName);
                    }
                    else{
                        d.getBase64((data) => {

                            if (!data) {
                                reject('empty')
                                return
                            }
    
                            this.$store.commit('globalpreloader', true)
    
                            this.core.vueapi.pdfviewer({
                                name: saveName,
                                base64: 'data:application/pdf;base64,' + data
                            }, {
                                mounted: () => {
                                    this.$store.commit('globalpreloader', false)
                                }
                            })
    
                            resolve()
                        });
                    }

                    

                })

            }).catch(e => {

                console.error(e)

                this.$store.commit('icon', {
                    icon: 'error'
                })

            }).finally(() => {
                this.making = false
                this.progress = 0
            })

        },

        cancel: function () {
            this.$emit('close')
        },


        rolloverFromLookup : function(){

            var selected = {}

            if (this.rollover)
                _.each(this.rollover.portfolios, (id) => {
                    selected[id] = {id}
                })


            this.core.vueapi.selectPortfolios((portfolios) => {

                this.rollover = {
                    portfolios : portfolios,
                    label : _.map(portfolios, (p) => {return p.name}).join("; ")
                }

            }, {selected})
        },
        rolloverFromOptimized : function(){

            console.log("HERE", this.optimized)
            this.$store.commit('globalpreloader', true)


            this.core.pct.optimization(this.portfolio, {
                ocr : this.optimized.ocr,
                scenario : this.optimized.scenario
            }).then(optimizedPorftolio => {
                this.rollover = {
                    portfolio : optimizedPorftolio,
                    label : this.portfolio.name + " / " + optimizedPorftolio.name
                }

                console.log('this.rollover', this.rollover)

            }).finally(() => {

                this.$store.commit('globalpreloader', false)

            })
        },
        rolloverRemove : function(){
            this.rollover = null
        }
    },
}