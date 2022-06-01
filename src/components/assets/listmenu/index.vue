<template>
<div class="listmenu">
    <list :items="items" @click="click">
        <template v-slot:default="slotProps">

            <div class="item">
                <i :class="slotProps.item.icon" />
                <span>{{$t(slotProps.item.text)}}</span>
            </div>

        </template>
    </list>
</div>
</template>

<style scoped lang="sass">
.item
    display: flex
    padding : 2 * $r
    align-items: center
    background: srgb(--neutral-grad-0)
    color : srgb(--neutral-grad-4)
    margin-bottom: $r
    border-radius: 22px
    i
        width: 33px
        text-align: center
        margin-right: $r

@media (pointer:fine)
    .item
        cursor: pointer
        +transition(0.3s)

        &:hover
            background: srgb(--neutral-grad-1)
</style>

<script>
import {
    mapState
} from 'vuex';

export default {
    name: 'listmenu',
    props: {
        items : Array,
        close : Function
    },
    computed: mapState({
        auth: state => state.auth,
    }),

    methods: {
        click : function(item){

            if(item.action) {
                if (typeof item.action == 'function'){
                    item.action()
                }
                else{
                    this.$emit('action', item.action)
                }
            }

            if(this.close) this.close()

        }
    },
}
</script>
