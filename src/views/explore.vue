<template>
<div class="page">

    <topheader :back="wnd ? '' : '/'">
        <template v-slot:info>
            <span>Explore</span>
        </template>
        <template v-slot:right>
            <tooltip>
                <template v-slot:item>
                    <div class="buttonpanel">
                        <i class="fas fa-ellipsis-v"></i>
                    </div>
                </template>

                <template v-slot:content="i">
                    <listmenu :items="menu" :close="i.close" />
                </template>

            </tooltip>
        </template>
    </topheader>

    <maincontent>

        <template v-slot:content>
            <homesearch ref="homesearch" @close="close"/>
        </template>

    </maincontent>

</div>
</template>

<style scoped lang="sass">

</style>

<script>
import homesearch from "@/components/modules/app/home/search/index.vue";

export default {
    name: 'explore_page',
    components: {
        homesearch
    },

    props : {
        wnd : Boolean
    },

    computed: {
        menu: function () {
            return [{
                text: 'labels.clearHistory',
                icon: 'fas fa-trash',
                action: this.clearHistory
            }]
        }
    },

    methods: {
        clearHistory: function () {

            this.core.activity.clear().then(r => {
                this.$refs.homesearch.reload()
            }).catch(e => {
                console.error(e)
            })

        },
        close : function(){
            this.$emit('close')
        }
    },

    mounted() {

    }
}
</script>
