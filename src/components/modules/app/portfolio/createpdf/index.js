import { mapState } from 'vuex';
import PDFTools from "@/application/lib/pdftools";
import moment from 'moment'
import _ from 'underscore';
import f from '@/application/functions'
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
            making: false
        }

    },

    created() {
        this.load()
        this.init()
    },

    watch: {
        //$route: 'getdata'
    },
    computed: mapState({
        auth: state => state.auth,
    }),


    methods: {
        changeReports: function (v) {
            this.values = v
        },
        init: function () {

            this.values = {}

            var f = _.filter(this.core.pdfreports.meta, (r) => {
                return !r.require
            })

            this.reports = _.map(f, (report) => {

                if (typeof report.default != 'undefined') this.values[report.key] = report.default

                return {
                    id: report.key,
                    input: 'checkbox',

                    text: 'pdfreports.reports.' + report.key,

                    rules: [{
                        rule: 'required'
                    }]
                }
            })

        },
        load: function () {
            this.core.api.pctapi.portfolios.get(this.id).then(r => {

                this.portfolio = r

                this.core.user.activity.template('portfoliopdf', this.portfolio)

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

        make: function () {

            moment.locale(this.$i18n.locale)

            this.making = true

            var nameOfReport = "New PCT report"

            this.core.settings.pdf.getall().then(settings => {
                
                console.log('settings', settings)

                var logotype = settings.logotype.value || settings.logotype.default

                if(!logotype){
                    return f.srcToData('./img/pdflogo.jfif')
                }
                
                return Promise.resolve(logotype)

            }).then((logotype) => {

                var pdftools = new PDFTools({
                    logo: logotype
                }, {

                    portfolio: this.portfolio,
                    profile: this.profile,
                    locale: this.$i18n.locale,
                    disclosure: this.core.settings.pdf.get('disclosure').value,
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



                    d.getBase64((data) => {

                        if (!data) {
                            reject('empty')
                            return
                        }

                        this.$store.commit('globalpreloader', true)

                        this.core.vueapi.pdfviewer({
                            name: nameOfReport,
                            base64: 'data:application/pdf;base64,' + data
                        }, {
                            mounted: () => {
                                this.$store.commit('globalpreloader', false)
                            }
                        })

                        resolve()
                    });

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
        }
    },
}