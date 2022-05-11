<template>
<div class="page">

    <topheader>
        <template v-slot:info>
            <span>Leads</span>
        </template>
        <template v-slot:right>
            <div class="buttonpanel" @click="sharequestionnaire">
                <i class="fas fa-link"></i>
            </div>
        </template>
    </topheader>

    <maincontent>

        <template v-slot:content>
            <leads />
        </template>

    </maincontent>

</div>
</template>

<style scoped lang="sass">

</style>

<script>
import leads from "@/components/modules/app/leads/index.vue";

export default {
    name: 'leads_page',
    components: {
        leads

    },

    computed: {

    },

    methods: {
        sharequestionnaire: function () {
            this.$store.commit('OPEN_MODAL', {
                id: 'modal_share',
                module: "share",
                caption: "Share Questionnaire",
                mclass : 'small',
                data : {
                    url : ''
                }
            })
        }
    },

    mounted() {

    }
}
</script>
