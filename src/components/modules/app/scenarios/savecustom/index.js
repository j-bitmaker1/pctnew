import { mapState } from 'vuex';

import factors from '../factors/index.vue'

export default {
    name: 'scenarios_savecustom',
    props: {
        factors : Object,
        edit : Object
    },

    components : {
        factors
    },

    data : function(){

        return {
            loading : false,
            description : '',
            name : '',
            fields : [{
                id : 'name',
                text : 'fields.customScenarioName',
                rules : [{
                    rule : 'required'
                }]
            },{
                id : 'description',
                text : 'fields.customScenarioDescription',
				input : 'textarea',
                rules : [{
                    rule : 'required'
                }]
            }]
        }

    },

    created () {

        if (this.edit){
            this.description = this.edit.description || ''
            this.name = this.edit.name || ''
        }
    },

    watch: {
        //$route: 'getdata'
    },
    computed: mapState({
        auth : state => state.auth,
    }),

    methods : {

        changeInfo : function(v){
			this.name = v.name
			this.description = v.description
		},

        cancel : function(){
            this.$emit('close')
        },
        save : function(){

			if(!this.name || !this.description){

				this.$store.commit('icon', {
					icon: 'error',
					message: "Please fill name and description of custom scenario"
				})

				setTimeout(() => {
					if (this.$refs.form)
						this.$refs.form.focusOnIntput()
				}, 2050)

				return 
			}

			var scenario = {
				name : this.name, 
				description : this.description,
				factors : _.map(this.factors, (f) => {
					return {
						name : f.name,
						value : f.value
					}
				})
			}

			var promise = null

			if (this.edit){

				scenario.id = this.edit.id

				promise = this.core.api.pctapi.customscenarios.update(scenario, {
					preloader : true,
					showStatus : true
				})

			}
			else{

				promise = this.core.api.pctapi.customscenarios.add(scenario, {
					preloader : true,
					showStatus : true
				})

			}

			promise.then(r => {
				this.$emit('success', {
                    result : r,
                    edited : this.edit ? true : false
                })
				this.$emit('close')
			})

			//
		}
    },
}