import { mapState } from 'vuex';

export default {
    name: 'settings_integrations_add',
    props: {
    },

    data : function(){

        return {
            loading : false,
            type : null,
            values : {}
        }

    },

    created : () => {

    },

    watch: {
        //$route: 'getdata'
    },
    computed: mapState({
        auth : state => state.auth,

        fieldsType : function(){
            return [
                {
                    id : 'type',
                    text : 'campaigns.fields.start.SignatureId',
                    input : 'select',
                    
                    values : [{
                        value : "none",
                        text : "Without signature"
                    }, {
                        value : "none2",
                        text : "Without signature2"
                    }],
                   
                    rules : []
                }
            ]
        },

        fields : function(){
           
            if(this.type == 'none2')
            return [
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
    }),

    methods : {
        input : function(){
            
        },

        inputType : function(v){
            this.type = v.type
            this.values = {}
        },

        save : function(){

        }
    },
}