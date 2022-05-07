import { mapState } from 'vuex';
import colors from "@/application/utils/colors.js";

export default {
    name: 'coloredNumber',
    props: ['number'],

    computed: mapState({
        auth : state => state.auth,

        color : function(){

            if(!this.number) return "#000000"

            var color = colors.colorFromGradient({
                gradient: [
                    {
                        color: [34, 136, 34, 1],
                        position: 0,
                    },
                    {
                        color: [254, 254, 34, 1],
                        position: 50,
                    },
                    {
                        color: [255, 36, 0, 1],
                        position: 100,
                    }
                ],
                value: this.number,
                toHex : true
            });

            return color

        },

        label : function(){

            if(!this.number) return '-'

            return this.number

        }
    }),
}