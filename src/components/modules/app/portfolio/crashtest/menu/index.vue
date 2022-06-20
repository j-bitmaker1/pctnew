<template>
<div class="portfolio_crashtest_menu">
    <tooltip>
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
        }
    },
    computed: mapState({
        auth: state => state.auth,

        menu: function() {

            return [
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
            
            ]
        }

    }),

    methods: {
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
