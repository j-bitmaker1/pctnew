<template>
<div class="page">

	<topheader back="/" :gray="true">
		<template v-slot:info>
			<span>{{name}}</span>
		</template>
		<template v-slot:right>
			<div class="buttonpanel">
				<i class="fas fa-ellipsis-v"></i>
			</div>
		</template>

        <template v-slot:additional>
			<linenavigation :items="navigation" :navdefault="navdefault" :navkey="navkey"/>
		</template>
        
	</topheader>

    <maincontent>
        <template v-slot:content>
            <component :is="module"/>
        </template>
    </maincontent>

</div>
</template>

<style scoped lang="sass">

</style>

<script>

import linenavigation from "@/components/assets/linenavigation/index.vue";

import shares from "@/components/modules/app/portfolios/shares/index.vue";
import crashtest from "@/components/modules/app/portfolios/crashtest/index.vue";
import capacity from "@/components/modules/app/portfolios/capacity/index.vue";

export default {
    name: 'portfolios_page',
    components: {
        linenavigation,
        shares,
        crashtest,
        capacity
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
                },
                {
                    text : 'labels.capacity',
                    id : 'capacity'
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
