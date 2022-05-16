import { mapState } from 'vuex';
import colors from "@/application/utils/colors.js";

export default {
    name: 'coloredNumber',
    props: ['number', 'mode'],

    computed: mapState({
        auth : state => state.auth,

        color : function(){

            if(!this.number) return "#000000"

            var color = colors.colorFromGradient({
                gradient: [
                    {
                        color: [...this.$store.getters.currentColorValue('--color-bad'), 1],
                        position: 0,
                    },
                    {
                        color: [...this.$store.getters.currentColorValue('--color-yellow'), 1],
                        position: 50,
                    },
                    {
                        color: [...this.$store.getters.currentColorValue('--color-good'), 1],
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