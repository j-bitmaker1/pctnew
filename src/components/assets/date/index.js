import { mapState } from 'vuex';
import moment from 'moment'
import f from "@/application/functions.js";

export default {
    name: 'date',
    props: ['date'],

    computed: mapState({
        auth : state => state.auth,

        label : function(){

            var date = this.date

            if(typeof date == 'string') date = f.date.fromstring(date, true)

            moment.locale(this.$i18n.locale)

            return moment(moment.utc(date)).local().fromNow();

        }
    }),
}