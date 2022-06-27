import { mapState } from 'vuex';

export default {
    name: 'checkboxtoggle',
    model: {
        prop: 'modelValue',
        event: 'update:modelValue'
    },
    props: {
        modelValue : Boolean,
    },

    data : function(){

        return {
            loading : false,

            icons : [
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

    created : () => {

    },

    watch: {
        //$route: 'getdata'
    },
    computed: {
        value: {
            get() {
                return this.modelValue ? 'use' : 'no'
            },
            set(value) {
                this.$emit('update:modelValue', value == 'use' ? true : false)
            }
        }
    },

    methods : {
        change : function(v){
            
        }
    },
}