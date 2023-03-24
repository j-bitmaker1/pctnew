<template>
<div class="portfolio_crashtest_menu">
    <tooltip :ext="ext">
        <template v-slot:item>
            <div :class="buttonclass">
                <i class="fas fa-cog"></i>
            </div>
        </template>

        <template v-slot:content="i">
            <listmenu :items="menu" :close="i.close" />
        </template>

    </tooltip>
</div>
</template>

<style scoped lang="sass">

</style>

<script>
import {
    mapState
} from 'vuex';

export default {
    name: 'portfolio_crashtest_menu',
    props: {
        buttonclass: {
            type: String,
            default: 'diconbutton'
        },

        cts : Object,

        ext : Boolean,

        portfolios : Object
    },
    computed: mapState({
        auth: state => state.auth,

        menu: function() {

            return _.filter([
                {
                    text: 'labels.scenarioManager',
                    icon: 'fas fa-tasks',
                    action: this.scenarioManager
                },
            
                {
                    text: 'labels.scoreConverter',
                    icon: 'fas fa-star',
                    action: this.scoreConverter
                },

                {
                    text: 'labels.ltrdetails',
                    icon: 'fas fa-info',
                    action: this.ltrdetails
                },

                this.cts ? {
                    text: 'labels.scenarioDefinitions',
                    icon: 'fas fa-receipt',
                    action: this.scenarioDefinitions
                } : null,
            
            ], e => e)
        }

    }),

    methods: {

        ltrdetails : function(){
            this.core.vueapi.portfolioLtrdetails({portfolios : this.portfolios})
        },

        scenarioDefinitions : function(){
            this.core.vueapi.scenarioDefinitions({portfolios : this.portfolios, cts : this.cts})
        },

        scenarioManager: function () {

            this.core.activity.template('action', this.core.activity.actions.scenarioManager())

			this.core.vueapi.scenarioManager((scenarios) => {
                this.$emit('scenariosChanged')
			})
        },

        scoreConverter: function () {

            this.core.activity.template('action', this.core.activity.actions.scoreConverter())

			this.core.vueapi.scoreConverter(() => {
                this.$emit('scoreConverterChanged')
			})
        }
    },
}
</script>
