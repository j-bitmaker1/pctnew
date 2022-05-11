import { mapState } from 'vuex';
import form from 'vuejs-form'
import _ from 'underscore';

export default {
    name: 'forms',
    props: {
        fields : Array
    },

    data : function(){

        return {
            loading : false,
            form : null
        }

    },

    created : function(){

        var f1 = {}
        var r1 = {}
        var m1 = {}

        _.each(this.fields, (f) => {
            f1[f.id] = f.value || ''

            r1[f.id] = _.map(f.rules || [], (r) => {
                return r.rule
            }).join('|')
            
            
            _.each(f.rules || [], (r) => {

                m1[f.id + '.' + r.rule] = r.rule == 'required' ? (this.$t(f.text) + ' is Required') : r.message ? this.$t(r.message) : ''

            })
        })

        this.form = new form(f1).rules(r1).messages(m1)

        console.log("this.form", this.form) 

    },

    watch: {
        //$route: 'getdata'
    },
    computed: mapState({
        auth : state => state.auth,
    }),

    methods : {
        get : function(ignoreerrors){
            if (this.form.validate().errors().any() && !ignoreerrors) return null;

            return this.form.all()
        }
    },
}