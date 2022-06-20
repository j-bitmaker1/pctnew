import { mapState } from 'vuex';

export default {
    name: 'registration',
    props: {
    },


    data : function(){

        return {
            loading : false,
            values : {},


            fields : [
                {
                    id : 'Email',
                    text : 'fields.Email',
                    rules : [{
                        rule : 'required'
                    },{
                        rule : 'email'
                    },{
                        rule : 'min:5'
                    }]
                },
                
                {
                    id : 'FirstName',
                    text : 'fields.FName',
                    rules : [{
                        rule : 'required'
                    }]
                },
                {
                    id : 'LastName',
                    text : 'fields.LName',
                    rules : [{
                        rule : 'required'
                    }]
                },
                {
                    id : 'CompanyName',
                    text : 'fields.Company',
                    rules : [{
                        rule : 'required'
                    }]
                },
                {
                    id : 'Title',
                    text : 'fields.Title',
                    rules : [{
                        rule : 'required'
                    }]
                },
                {
                    id : 'Phone',
                    text : 'fields.Phone',
                    rules : [{
                        rule : 'required'
                    },{
                        rule : 'phone'
                    },{
                        rule : 'min:5'
                    }]
                },
                {
                    id : 'MobilePhone',
                    text : 'fields.mobilephone'
                },
                {
                    id : 'Zip',
                    text : 'fields.Zip',
                    rules : []
                },
                {
                    id : 'State',
                    text : 'fields.State',
                    rules : [{
                        rule : 'max:2'
                    }]
                },
                {
                    id : 'City',
                    text : 'fields.City',
                    rules : []
                },
                {
                    id : 'Address1',
                    text : 'fields.Address1',
                    rules : []
                },
                {
                    id : 'Address2',
                    text : 'fields.Address2',
                    rules : []
                },
                {
                    id : 'LinkedIn',
                    text : 'fields.linkedin',
                    rules : []
                },
                {
                    id : 'Password',
                    text : 'fields.password',
                    type : "password",
                    rules : [{
                        rule : 'required'
                    },{
                        message : 'fields.strongpassword',
                        rule : 'regex:^(?=.*[!@#$%^&*-])(?=.*[0-9])(?=.*[A-Z]).{8,20}$'
                    }]
                },
                {
                    id : 'Confirm password field',
                    text : 'fields.confirmpassword',
                    type : "password",
                    rules : [{
                        rule : 'required'
                    },{
                        rule : 'same:Password'
                    }]
                }
            ]
        }

    },

    created() {
        
    },

    mounted(){
        this.$refs.fields.get()
    },

    watch: {
        //$route: 'getdata'
    },
    computed: mapState({
        auth : state => state.auth,
        valid : function(){
            return !_.isEmpty(this.values)/* && this.values.Password && (this.values.Password == this.values.cpassword)*/
        }
    }),

    methods : {
        save : function(){

            this.values = this.$refs.fields.get()

            if (!this.valid){
                this.$message({
                    title : "Invalide details",
                    message : "Please fill all required fields"
                })

                return
            }

            var data = _.clone(this.values)

            delete data['Confirm password field']

            data.TimeZone = 0
            
            data.Product = _.map(_.filter(this.core.user.product, (p) => {
                return p.trial
            }), (p) => {
                return p.id
            }).join(',')

            data.CompanyName  = data.CompanyName + "_" + data.Email

            this.$store.commit('globalpreloader', true)

            this.core.user.signup(data).then(r => {

                this.$router.push('/confirm?type=email&email=' + data.Email)

            }).catch((e) => {

                this.$store.commit('icon', {
					icon: 'error',
					message: e.error || "Something went wrong."
				})

            }).finally(() => {
                this.$store.commit('globalpreloader', false)
            })
        },

        input : function(v){
            this.values = v
            console.log("V", v)
        }
    },
}