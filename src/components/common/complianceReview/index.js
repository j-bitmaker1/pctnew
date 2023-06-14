import { mapState } from 'vuex';
var EmailValidator = require("email-validator");
export default {
    name: 'complianceReview',
    props: {
        text : String
    },

    data : function(){

        return {
            loading : false,
            email : ''
        }

    },

    created : () => {

    },

    watch: {
        //$route: 'getdata'
    },
    computed: mapState({
        auth : state => state.auth,

        emailfail : function(){

            if (EmailValidator.validate(this.email)) return false

            return true
        }
    }),

    methods : {
        cancel : function(){
            this.$emit('close')
        },

        send : function(){
            this.$emit('close')
        }
    },
}