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
            usekeyscenariosSetting : 'use',
            usekeyscenarios : '',

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

        this.usekeyscenarios = this.usekeyscenariosSetting

        
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
            var u = {
                ... this.changeusing
            }

            if(this.usekeyscenarios == 'use'){
                u[1] = true
                u[2] = true
                u[3] = true
            }

			return  u
		},

        canchange : function(){
            return this.usekeyscenarios == 'no'
        },

        showsave : function(){


            return (
                this.usekeyscenarios != this.usekeyscenariosSetting
            ) || (this.canchange && !_.isEmpty(this.changeusing))
        },
      
        canapply : function(){
            return _.toArray(this.using).length > 0
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
            this.core.pct.scenarios().then(scenarios => {
				this.scenarios = scenarios

			})
        },

        search : function(v){
            this.searchvalue = v
        },

        cancel : function(){
            this.changeusing = {}
        },

        apply : function(){
            this.changeusing = {}
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