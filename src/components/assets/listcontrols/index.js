import { mapState } from 'vuex';

export default {
    name: 'listcontrols',
    
    props: {
        searchvalue : String,
        count : Number,
        sorting : Object,
        listdate : {
            type : Array,
            default : () => {return []}
        },
        sortvalue : String,
        activity : String,
        datepicker : Object,
        store : String
    },


    data : function(){

        return {
            loading : false,
        }

    },

    created (){
        this.load()
    },

    watch: {
        listdate : function(){
            this.save()
        },
        sortvalue : function(){
            this.save()
        },
        searchvalue : function(){
            this.save()
        }


    },
    computed: {
        date: {
            get() {
                return this.listdate
            },
            set(value) {
                this.$emit('date', value)

            }
        },

        ...mapState({
            auth : state => state.auth,
        })
    },
    

    methods : {
        search : function(v){
            this.$emit('search', v)

        },
        sort : function(e){
            this.$emit('sort', e.target.value)

        },

        load : function(){

            if (this.store){

                this.core.settings.ui.setmetaOne('listcontrols_' + this.store, {
                    name: 'listcontrols_' + this.store,
                    default: function() {
                        return {
                            sortvalue : null,
                            date : [],
                            searchvalue : ''
                        }
                    },
                })

                this.core.settings.ui.getall()

                var values = this.core.settings.ui.get('listcontrols_' + this.store).value

                if (values.sortvalue) this.$emit('sort', values.sortvalue)
                if (values.searchvalue) this.$emit('search', values.searchvalue)
                if (_.isEmpty(values.date)) this.$emit('date', values.date)
            }

        },

        save : function(){
            if(this.store){
                
                console.log({
                    sortvalue : this.sortvalue,
                    date : this.date,
                    searchvalue : this.searchvalue
                }, 'save')

                setTimeout(() => {
                    this.core.settings.ui.set('listcontrols_' + this.store, {
                        sortvalue : this.sortvalue,
                        date : this.date,
                        searchvalue : this.searchvalue
                    })
                }, 100)

                
            }
        }
    },
}