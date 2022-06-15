import _ from 'underscore';
import { mapState } from 'vuex';
import f from '../../../../../application/functions';

import scenario from '../scenario/index.vue'
export default {
    name: 'scenarios_list',
    props: {
       
    },

    components : {
        scenario
    },

    data : function(){

        return {
            loading : true,
            scenarios : [],

            searchvalue : '',

            changeusing : {},
            initialusing : {},
            initialusingcustom : {},

            mincount : 4,

        }

    },

    created () {
        this.get()

        
    },

    watch: {
        //$route: 'getdata'
    },
    computed: mapState({
        auth : state => state.auth,
        menu : function(){
            return null
        },

        using : function(){
            var u = {}

            u = {
                ... this.changeusing
            }

			return  u
		},


        showsave : function(){
            return (JSON.stringify(this.changeusing) != JSON.stringify(this.initialusing))
        },

        prefiltered : function(){
            return _.filter(this.scenarios, function(scenario){
                return scenario.id > 0 || scenario.custom
            })
        },

        filtered : function(){
            if(this.searchvalue){

                return f.clientsearch(this.searchvalue, this.prefiltered, (scenario) => {
                    return (scenario.name + ' ' + (scenario.region || "") + ' ' + (scenario.keywords || []).join(' '))
                })
            }
            else{
                return this.prefiltered
            }
        },

        grouped : function(){

            return f.group(_.sortBy(this.filtered, (scenario) => {

                if(this.initialusingcustom[scenario.id]) return 0
                if(scenario.custom) return 1
                if(scenario.key) return 2

                return 3

            }), (scenario) => {

                if(this.initialusingcustom[scenario.id]) {
                    return "Used scenarios"
                }

                if(scenario.custom) return "Your custom scenarios"
                if(scenario.key) return "Key scenarios"

                return scenario.region

            })
        }

    }),

    methods : {

        createCustomScenario : function(){
			this.core.vueapi.createCustomScenario({}, () => {
                this.get()
            })
		},

        get : function(){

            this.loading = true

            return this.core.pct.scenarios().then(scenarios => {
                return this.core.api.pctapi.customscenarios.list().then(r => {

                    this.scenarios = scenarios.concat(r || [])

                    return this.core.settings.stress.getall()
                })

			}).then(settings => {

                this.initialusing = {}
                this.changeusing = {}

                if (!settings.scenarios.value.length){
                    this.initialusing = this.getdefault() 
                    this.changeusing = this.getdefault()
                }
                else{
                    _.each(settings.scenarios.value, (id) => {

                        if(_.find(this.scenarios, (s) => {
                            return s.id == id
                        })){
                            this.initialusingcustom[id] = this.initialusing[id] = this.changeusing[id] = true
                        }
                        
                    })
                }
                
            }).finally(() => {
                this.loading = false
            })

            
        },

        useDefault : function(){
            this.changeusing = this.getdefault()
            this.initialusingcustom = {}
        },

        isitdefault : function(){
            var u1 = this.getdefault()
            var ch = this.changeusing

            var dif = false

            _.each(u1, (v, i) => {
                if(!ch[i]) dif = true
            })

            _.each(ch, (v, i) => {
                if(!u1[i]) dif = true
            })

            return !dif
        },

        getdefault : function(){
            var u = {}

            _.each(this.scenarios, (s) => {
                if(s.key) u[s.id] = true
            })

            return u
        },

        unselectAll : function(){
            this.changeusing = {}
            this.initialusingcustom = {}
        },

        save : function(){

            var promises = []

            if (JSON.stringify(this.changeusing) != JSON.stringify(this.initialusing)){

                var value = _.map(this.changeusing, (v, i) => {return i})

                var ids = this.isitdefault() ? [] :  value

                if(value.length < this.mincount){

                    this.$store.commit('icon', {
                        icon: 'error',
                        message: "Please select at least " + this.mincount + " scenarios"
                    })

                    return Promise.reject('min')
                }

                promises.push(this.core.settings.stress.set('scenarios', ids))
            }

            this.$store.commit('globalpreloader', true)

            return Promise.all(promises).then(r => {
                return Promise.resolve()
            }).finally(() => {
                this.$store.commit('globalpreloader', false)
            })
        },

        search : function(v){
            this.searchvalue = v
        },

        cancel : function(){
            this.changeusing = {...this.initialusing || {}}
        },

        apply : function(){
            this.save().then(r => {
                this.$emit('changed')
                this.$emit('close')
            }).catch(e => {})
        },

        useChange : function(id, v){

            console.log('useChange', this.changeusing, id, v)

            if (this.changeusing[id]){
                this.$delete(this.changeusing, id)
            }
            else{
                this.$set(this.changeusing, id, v)
            }
        },

        removed : function(oldscenario){

            if (this.changeusing[oldscenario.id]) this.$delete(this.changeusing, oldscenario.id)

            if (this.initialusing[oldscenario.id]) {
                this.$delete(this.initialusing, oldscenario.id)
            }

            this.scenarios = _.filter(this.scenarios, (s) => {
                return s.id == oldscenario.id
            })

        },

        changed : function(oldscenario, scenario){
            /*var i = _.findIndex(this.scenarios, (s) => {
                return s.id == oldscenario.id
            })*/
            
        },
    },
}