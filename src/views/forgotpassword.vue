<template>
<div class="page">

    <topheader back="back" />

    <maincontent>
        <template v-slot:content>
            <forgotpassword />
        </template>
    </maincontent>

</div>
</template>

<style scoped lang="sass">

</style>

<script>
import forgotpassword from "@/components/common/forgotpassword/index.vue";

export default {
    name: 'forgotpassword_page',
    components: {
        forgotpassword
    },

    computed: {

    },

    methods: {

    },

    mounted() {

    }
}
</script>
