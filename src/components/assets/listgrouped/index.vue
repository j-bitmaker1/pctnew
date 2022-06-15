<template>
<div class="listgrouped">
    <list :items="group">
        <template v-slot:default="slotProps">
    
            <div class="group">
                <slot name="group" :item="slotProps.item" :index="slotProps.index"></slot>

                <component :is="module" :items="slotProps.item" v-bind="select">
                    <template v-slot:default="slotProps">
                        <slot name="list" :item="slotProps.item" :index="slotProps.index"></slot>
                    </template>
                </component>

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
        group: Object,
        select : null
    },
    computed: mapState({
        auth: state => state.auth,
        module : function(){
            if(this.select){
                return 'listselectable'
            }
            else{
                return 'list'
            }
        }
    }),

    methods: {
    },
}
</script>
