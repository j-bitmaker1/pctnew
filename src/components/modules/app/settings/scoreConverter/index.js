import { mapState } from 'vuex';

export default {
    name: 'settings_scoreConverter',
    props: {
    },

    data : function(){

        return {
            loading : false,

            useSchema : 'no',
            userDefinedValues : {},
            portfolios : [],
            scores : {},
            useSchemaIcons : [
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
        this.load()
    },

    watch: {
        //$route: 'getdata'
    },
    computed: mapState({
        auth : state => state.auth,

        haschanges : function(){
            return this.useSchema != this.core.pct.scoreConverter.use || 
            JSON.stringify(this.userDefinedValues) != JSON.stringify(this.core.pct.scoreConverter.userDefined)
        }
    }),

    methods : {
        load : function(){
            this.loading = true

            this.core.pct.scoreConverter.prepare().then(() => {

                this.scores = this.core.pct.scoreConverter.scores
                this.portfolios = this.core.pct.scoreConverter.portfolios
                this.useSchema = this.core.pct.scoreConverter.use
                this.userDefinedValues = _.clone(this.core.pct.scoreConverter.userDefined)

            }).finally(() => {
                this.loading = false
            })
        },
        changeUse : function(v){
            this.useSchema = v
        },

        cancel : function(){
            this.$emit('cancel')
            this.close()
        },

        close : function(){
            this.$emit('close')
        },

        apply : function(){

            var userDefined = {
                use : this.useSchema,
                scores : _.clone(this.userDefinedValues)
            }

            this.$store.commit('globalpreloader', true)

            return this.core.pct.scoreConverter.setScores(userDefined).then(r => {
                this.$emit('changed')
                this.close()
            }).finally(() => {
                this.$store.commit('globalpreloader', false)
            })

            
        },

        setValue : function(v, portfolio){

            if(!v){
                this.$delete(this.userDefinedValues, portfolio)
            }

            else{

                if(v < 1) v = 1
                if(v > 99) v = 99

                this.$set(this.userDefinedValues, portfolio, v)
            }

        }
    },
}