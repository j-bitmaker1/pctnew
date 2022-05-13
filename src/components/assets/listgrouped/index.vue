<template>
<div class="listgrouped">
    <list :items="group">
        <template v-slot:default="slotProps">

            <div class="group">
                <slot name="group" :item="slotProps.item" :index="slotProps.index"></slot>

                <list :items="slotProps.item.items">
                    <template v-slot:default="slotProps">
                        <slot name="list" :item="slotProps.item" :index="slotProps.index"></slot>
                    </template>
                </list>

            </div>

        </template>
    </list>
</div>
</template>

<style scoped lang="sass">

</style>

<script>
import {
    mapState
} from 'vuex';

export default {
    name: 'listgrouped',
    props: {
        group: Array
    },
    computed: mapState({
        auth: state => state.auth,
    }),

    methods: {

    },
}
</script>
