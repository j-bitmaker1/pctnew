import { mapState } from 'vuex';
import colors from "@/application/utils/colors.js";

export default {
    name: 'coloredNumber',
    props: ['number', 'mode', 'reversed'],

    computed: mapState({
        auth : state => state.auth,

        gradient : function(){
            var g = [
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
            ]

            if(this.reversed) {
                g = [
                    {
                        color: [...this.$store.getters.currentColorValue('--color-bad'), 1],
                        position: 100,
                    },
                    {
                        color: [...this.$store.getters.currentColorValue('--color-yellow'), 1],
                        position: 50,
                    },
                    {
                        color: [...this.$store.getters.currentColorValue('--color-good'), 1],
                        position: 0,
                    }
                ]
            }

            return g

        },

        color : function(){

            if(!this.number) return "#000000"

            var color = colors.colorFromGradient({
                gradient: this.gradient,
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