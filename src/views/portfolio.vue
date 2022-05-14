<template>
<div class="page">

	<topheader back="back" :gray="true">
		<template v-slot:info>
			<span>{{name}}</span>
		</template>
		<template v-slot:right>
			<div class="buttonpanel">
				<i class="fas fa-ellipsis-v"></i>
			</div>
		</template>
	</topheader>

    <maincontent>
        <template v-slot:content>
            <div class="linenavigation">
                <linenavigation :items="navigation" :navdefault="navdefault" :navkey="navkey"/>
            </div>
            <component :is="module"/>
        </template>
    </maincontent>

</div>
</template>

<style scoped lang="sass">
.linenavigation
    background: srgb(--background-secondary-theme)
    margin-bottom: $r
</style>

<script>

import linenavigation from "@/components/assets/linenavigation/index.vue";

import shares from "@/components/modules/app/portfolio/shares/index.vue";
import crashtest from "@/components/modules/app/portfolio/crashtest/index.vue";


export default {
    name: 'portfolios_page',
    components: {
        linenavigation,
        shares,
        crashtest
    },

    computed: {
        name : function(){
            return 'Sample moderate'
        },

        module : function(){
            return this.active
        },

        active : function(){
            return this.$route.query[this.navkey] || this.navdefault
        },
    },

    data : function(){
        return {
            navigation : [
                {
                    text : 'labels.crashtest',
                    id : 'crashtest'
                },
                {
                    text : 'labels.shares',
                    id : 'shares'
                }
            ],

            navkey : 'p',

            navdefault : 'shares'
        }
    },

    methods: {
		newportfolio : function(){
			this.$store.commit('OPEN_MODAL', {
                id : 'modal_portfolios_edit',
                module : "portfolios_edit",
                caption : "New Portfolio"
            })
		}
    },

    mounted() {

    }
}
</script>
