import { mapState } from 'vuex';

export default {
    name: 'Authorization',


    data : function(){

        return {
            login : '',
            password : '',
            loading : false
        }

    },

    created : function(){
        this.login = this.$store.state.lastlogin || ''
    },

    watch: {
        //$route: 'getdata'
    },

    computed: mapState({
        auth : state => state.auth,
    }),

    methods : {
      
        signin : function(){

            this.$store.commit('lastlogin', this.login)

            this.core.user.signin({

                password_value : this.password,
                login_value :  this.login

            }).then(state => {

                this.$router.push('/')

            }).catch(e => {

                console.error(e)

                if(e.code == '401'){

                    this.$message({
                        title : "Invalid Access Details",
                        message : "Wrong Username or Password"
                    })
                }
                
            })

        },

        keyuplogin : function(v){
			this.login = v.target.value
		},

        changelogin : function(v){
			this.login = v.target.value
        },

       
    },

    props: {
        caption : String
    },

}