import { mapState } from 'vuex';
import PincodeInput from 'vue-pincode-input';

export default {
    name: 'pincode',
    props: {
        length : {
            type : Number,
            default : 4
        },

        mode : String,
        attemp : Number,
        check : Function,
        confirm : Boolean
    },

    components : {
        PincodeInput
    },

    data : function(){

        return {
            loading : false,
            code : '',
            confirmcode : '',
            attemps : 0,
            error : false
        }

    },

    created () {
        console.log("this", this.confirm)
    },

    watch: {
        validcode : function(c){
            if (c && !this.confirm){
                if(this.attemps < this.attemp - 1){
                    this.result()
                }
            }
        }
    },
    computed: mapState({
        auth : state => state.auth,

        fields : function(){
            var fields = [{
                id : 'pincode',
                text : 'pincode',
                type : 'password',
                rules : [{
                    rule : 'required'
                },{
                    rule : 'min:' + this.length
                },{
                    rule : 'max:' + this.length
                }]
            }]

            if(this.confirm){
                fields.push({
                    id : 'pincodeconfirm',
                    text : 'pincodeconfirm',
                    type : 'password',
                    rules : [{
                        rule : 'required'
                    },{
                        rule : 'min:' + this.length
                    },{
                        rule : 'max:' + this.length
                    }]
                })
            }

            return fields
        },

        validcode : function(){
            return this.code && this.code.length == this.length
        }
    }),

    methods : {
        cancel : function(){
            this.$emit('cancel')
            this.close()
        },
        close : function(){
            this.$emit('close')
        },

        back : function(){
            this.code = ''
        },

        result : function(){
            if (this.error) return
            if (this.validcode){

                if(this.mode == 'create'){
                    if(!this.confirm || this.confirmcode == this.code){
                        this.success()
                    }
                }

                
                if(this.mode == 'enter'){
                    if(this.check){
                        this.check(this.code).then(() => {

                            this.$store.commit('icon', {
                                icon: 'success'
                            })

                            this.success()
                        }).catch(e => {
                            this.attemps++

                            if (this.attemps >= this.attemp){

                                this.$store.commit('icon', {
                                    icon: 'error',
                                    message: "You spent three attempts to enter the pin code"
                                })


                                this.cancel()
                                return 
                            }

                            
                            this.error = true

                            setTimeout(() => {
                                this.code = ''
                                this.error = false
                            }, 500)
                        })
                    }

                    else{
                        this.success()
                    }
                }
            }
        },

        success : function(){
            this.$emit("success", this.code)
            this.close()
        }
    },
}