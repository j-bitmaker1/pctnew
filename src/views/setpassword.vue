<template>
<div class="page">

    <topheader back="back"/>

    <maincontent>
        <template v-slot:content>
            <setpassword />
        </template>
    </maincontent>

</div>
</template>

<style scoped lang="sass">

</style>

<script>
import setpassword from "@/components/common/setpassword/index.vue";

export default {
    name: 'setpassword_page',
    components: {
        setpassword
    },

    computed: {

    },

    methods: {

    },

    mounted() {

    }
}
</script>
