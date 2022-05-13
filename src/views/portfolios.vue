<template>
<div class="page">

	<topheader>
		<template v-slot:info>
			<span>Portfolios</span>
		</template>
		<template v-slot:right>
			<div class="buttonpanel">
				<i class="fas fa-plus" @click="newportfolio"></i>
			</div>
		</template>
	</topheader>

    <maincontent>
        <template v-slot:content>
            <portfolioslist />
        </template>
    </maincontent>

</div>
</template>

<style scoped lang="sass">

</style>

<script>

import portfolioslist from "@/components/modules/app/portfolios/list/index.vue";

export default {
    name: 'portfolios_page',
    components: {
        portfolioslist
    },

    computed: {
        
    },

    methods: {
		newportfolio : function(){
			this.$store.commit('OPEN_MODAL', {
                id : 'modal_portfolios_edit',
                module : "portfolio_edit",
                caption : "New Portfolio"
            })
		}
    },

    mounted() {

    }
}
</script>
