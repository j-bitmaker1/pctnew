<template>
<div class="listgrouped">
    <list :items="group">
        <template v-slot:default="slotProps">
    
            <div class="group">
                <slot name="group" :item="slotProps.item" :index="slotProps.index"></slot>

                <list :items="slotProps.item">
                    <template v-slot:default="slotProps">
                        <slot name="list" :item="slotProps.item" :index="slotProps.index"></slot>
                    </template>
                </list>

                <slot name="groupafter" :item="slotProps.item" :index="slotProps.index"></slot>

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
        group: Object
    },
    computed: mapState({
        auth: state => state.auth,
    }),

    methods: {

    },
}
</script>
