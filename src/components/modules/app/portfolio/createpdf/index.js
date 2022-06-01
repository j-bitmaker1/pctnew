import { mapState } from 'vuex';

export default {
    name: 'portfolio_createpdf',
    props: {
        id : Number
    },

    data : function(){

        return {
            loading : true,
            portfolio : null,
            profile : null
        }

    },

    created (){
        this.load()
    },

    watch: {
        //$route: 'getdata'
    },
    computed: mapState({
        auth : state => state.auth,
    }),

    methods : {
        load : function(){
            this.core.api.pctapi.portfolios.get(this.id).then(r => {

				this.portfolio = r

                this.core.user.activity.template('portfoliopdf', this.portfolio)

				if(!r.crmContactId){
					return Promise.resolve()
				}

				

				return this.core.api.crm.contacts.gets({Ids : [r.crmContactId]}).then(c => {
					this.profile = c[0]
				})

			}).finally(() => {
				this.loading = false
			})
        },

        make : function(){
            this.$emit('close')
        },

        cancel : function(){
            this.$emit('close')
        }
    },
}