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
            loading : false,
            scenarios : [],
            searchvalue : '',
            changeusing : {},
            initialusing : {},
            //usekeyscenariosSetting : 'use',
            usekeyscenarios : '',

            mincount : 4,

            keyscenarios : [
				{
					icon : "fas fa-check",
					id : 'use',
                    good : true
				},
				{
					icon : "fas fa-times",
					id : 'no'
				}
			],
            
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

            if(this.usekeyscenarios == 'use'){
                _.each(this.scenarios, (s) => {
                    if(s.key) u[s.id] = true
                })
            }
            else{
                u = {
                    ... this.changeusing
                }
            }

			return  u
		},

        canchange : function(){
            return this.usekeyscenarios == 'no'
        },

        showsave : function(){
            return (
                this.usekeyscenarios != this.usekeyscenariosSetting
            ) || (this.canchange && JSON.stringify(this.changeusing) != JSON.stringify(this.initialusing))
        },
      
        canapply : function(){
            return _.toArray(this.using).length >= this.mincount
        },

        prefiltered : function(){
            return _.filter(this.scenarios, function(scenario){
                return scenario.id > 0
            })
        },

        filtered : function(){
            if(this.searchvalue){

                return f.clientsearch(this.searchvalue, this.prefiltered, (scenario) => {
                    return (scenario.name + ' ' + (scenario.region || "") + ' ' + scenario.keywords.join(' '))
                })
            }
            else{
                return this.prefiltered
            }
        }
    }),

    methods : {
        get : function(){

            this.core.settings.stress.getall().then(settings => {

                this.usekeyscenarios = this.cuse(settings.useKeyScenarios.value)
                this.usekeyscenariosSetting = this.usekeyscenarios

                this.initialusing = {}
                this.changeusing = {}

                _.each(settings.scenarios.value, (id) => {
                    this.initialusing[id] = true
                    this.changeusing[id] = true
                })

                return this.core.pct.scenarios()
            }).then(scenarios => {
				this.scenarios = scenarios
			}).finally(() => {
                this.loading = false
            })

            
        },

        cuse : function(v){
            if(v) return 'use'
            return 'no'
        },

        vuse : function(v){
            if(v == 'use') return true

            return false
        },

        save : function(){

            var promises = []

            if (this.usekeyscenarios != this.usekeyscenariosSetting){
                promises.push(this.core.settings.stress.set('useKeyScenarios', this.vuse(this.usekeyscenarios)))
            }

            if (JSON.stringify(this.changeusing) != JSON.stringify(this.initialusing)){
                var ids = _.map(this.changeusing, (v, i) => {return i})

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
            this.changeusing = {}
        },

        apply : function(){
            this.save().then(r => {
                this.$emit('changed')
                this.$emit('close')
            })
        },

        useChange : function(id, v){

            if(!this.canchange){

                this.core.notifier.simplemessage({
                    icon : "fas fa-exclamation-triangle",
                    title : "Use key scenarios selected",
                    message : "To be able to select scenarios you need to uncheck Use key scenarios"
                })

                return
            }

            if(typeof this.changeusing[id] != 'undefined'){
                if (this.changeusing[id] == v) {
                    this.$delete(this.changeusing, id)
                    return
                }
            }

            this.$set(this.changeusing, id, v)
        },

        changeKeyScenariosUse : function(v){
            this.usekeyscenarios = v
        }
    },
}