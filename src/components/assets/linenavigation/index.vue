<template>
<div id="linenavigation" :class="{buttons}">
    
    <div class="item" :class="{active : active == item.id}" v-for="item in items">
        <router-link :to="'?' + navkey + '=' + item.id" v-if="mode == 'history'">
            <i :class="item.icon" v-if="item.icon"></i> <span>{{$t(item.text)}}</span>
        </router-link>

        <div v-else @click="change(item.id)">
            <i :class="item.icon" v-if="item.icon"></i> <span>{{$t(item.text)}}</span>
        </div>
    </div>
    
</div>
</template>

<style scoped lang="sass">

#linenavigation
    display: flex
    align-items: center
    justify-content: space-around

    .item
        flex-grow: 2
        flex-basis: 300px
        height: 55px
        line-height: 55px
        white-space: nowrap
        text-align: center
        border-bottom: 2px solid srgb(--neutral-grad-1)
        
        a
            width: 100%

        span
            font-size: 0.9em
            font-weight: 500

        &.active
            border-bottom: 2px solid srgb(--color-bg-ac-bright)

    &.buttons
        border : 1px solid srgb(--neutral-grad-1)
        border-radius: 12px
        .item
            height: 44px
            line-height: 44px
            padding : 0 2 * $r
            border : 0

            i,
            span
                font-size: 0.9em


            &.active
                background: srgb(--color-bg-ac-bright)
                color : srgb(--text-on-bg-shadow-color)
                border-color: srgb(--color-bg-ac-bright)
                border-radius: 12px
                
        

</style>

<script>
import {
    mapState
} from 'vuex';

export default {
    name: 'linenavigation',
    props: {
        items: Array,
        navdefault : String,
        buttons : Boolean,
        navkey : String,
        mode : {
            type : String,
            default : 'history'
        }
    },
    computed: mapState({
        auth: state => state.auth,

        active : function(){
            return this.$route.query[this.navkey] || this.navdefault
        },

        change : function(v){
            this.$emit('change', v)
        }

    }),

    methods: {

    },
}
</script>
