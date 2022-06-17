import { mapState } from 'vuex';
import moment from 'moment'
import f from "@/application/functions.js";

export default {
    name: 'date',
    props: {
        date : [String, Date],
        relative : {
            type : Boolean,
            default : true
        }
    },

    computed: mapState({
        auth : state => state.auth,

        label : function(){

            var date = this.date

            if(typeof date == 'string') date = f.date.fromstring(date, true)

            moment.locale(this.$i18n.locale)

            var e = moment(moment.utc(date)).local()

            if(this.relative) return e.fromNow();

            return e.format('MM/DD/YYYY');

        }
    }),
}