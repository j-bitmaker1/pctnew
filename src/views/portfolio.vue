<template>
<div class="page">

	<topheader back="/portfolios" :gray="true">
		<template v-slot:info>
			<span>{{name}}</span>
		</template>
		<template v-slot:right>
			<portfoliomenu v-if="!loading && portfolio" @edit="editportfolio" @delete="deleteportfolio" :portfolio="portfolio" />
		</template>
	</topheader>

    <maincontent>
        <template v-slot:content>
            <div class="linenavigation">
                <linenavigation :items="navigation" :navdefault="navdefault" :navkey="navkey"/>
            </div>
            <component :is="module" v-if="!loading && portfolio"/>
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
import portfoliomenu from '@/components/modules/app/portfolio/menu/index.vue'

export default {
    name: 'portfolios_page',
    components: {
        linenavigation,
        shares,
        crashtest,
        portfoliomenu
    },

    computed: {
        name : function(){

            if(this.portfolio) return this.portfolio.name
            
            return ''
        },

        module : function(){
            return this.active
        },

        active : function(){
            return this.$route.query[this.navkey] || this.navdefault
        },

        id : function(){
            return this.portfolioid || this.$route.params.id
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

            portfolio : null,

            navkey : 'p',

            loading : false,

            navdefault : 'shares'
        }
    },

    methods: {
		load : function(){
            this.loading = true
            this.core.api.pctapi.portfolios.get(this.id).then(r => {

                this.portfolio = r

            }).finally(() => {
                this.loading = false
            })
        },
        deleteportfolio : function(){
            this.$router.push('/portfolios')
        },

        editportfolio : function(portfolio){
            this.portfolio = portfolio
        }
    },

    created() {
        this.load()
    }
}
</script>
