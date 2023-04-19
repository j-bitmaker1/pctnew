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
        store : String,
        filters : Object,
        filterValues : Object,
        dfilterValues : Object
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
        },
        filterValues : function(){
            this.save()
        }, 


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

        filtersApplyied : function(){
            console.log(JSON.stringify(this.filterValues), JSON.stringify(this.dfilterValues))
            return JSON.stringify(this.filterValues) != JSON.stringify(this.dfilterValues)
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

                console.log('values', values)

                if (values.sortvalue) this.$emit('sort', values.sortvalue)
                if (values.searchvalue) this.$emit('search', values.searchvalue)
                if (values.filters) this.$emit('filtering', values.filters)
                if (_.isEmpty(values.date)) this.$emit('date', values.date)
            }

        },

        save : function(){
            if(this.store){
                

                setTimeout(() => {
                    this.core.settings.ui.set('listcontrols_' + this.store, {
                        sortvalue : this.sortvalue,
                        date : this.date,
                        searchvalue : this.searchvalue,
                        filters : this.filterValues
                    })
                }, 100)

                
            }
        },

        showfilters : function(){

            this.core.vueapi.editcustom(
                
                {
                    schema : this.filters, 
                    values: this.filterValues, 
                    caption : "Filter", 
                    mclass : "filters",
                    ignoreerrors : true

                }, (values) => {
                
                console.log("EMIT", values)
                this.$emit('filtering', values)
            })

        }
    },
}