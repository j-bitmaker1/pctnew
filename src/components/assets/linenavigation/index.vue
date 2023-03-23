<template>
<div id="linenavigation" class="mobp unselectable" :class="{buttons : true, second}">
    <div class="wrapper">
        <div class="item" :class="{active : active == item.id}" :key="item.id" v-for="item in items">

            <div @click="e => {change(item.id)}">
                <i :class="item.icon" v-if="item.icon"></i> <span>{{$t(item.text)}}</span>
            </div>
        </div>
    </div>
    
</div>
</template>

<style scoped lang="sass">

#linenavigation
    padding-bottom: $r

    .wrapper
        justify-content: center
        display: flex
        align-items: center
        grid-gap: $r
        flex-wrap: wrap

    .item
        height: 7 * $r
        line-height: 7 * $r
        white-space: nowrap
        text-align: center
        border-bottom: 2px solid srgb(--neutral-grad-1)
        i
            color : srgb(--neutral-grad-2)
            margin-right: $r
            font-size: 0.8em
        a
            width: 100%

        span
            font-size: 0.9em
            font-weight: 500

        &.active
            border-bottom: 2px solid srgb(--color-bg-ac-bright)

    &.buttons
        
        .wrapper
            grid-gap: 0

        .item
            height: 6 * $r
            line-height: 6 * $r
            padding : 0 2 * $r
            border : 0

            i,
            span
                font-size: 0.9em

            &.active
                background: srgb(--color-bg-ac-bright)
                color : srgb(--text-on-bg-shadow-color)
                border-color: srgb(--color-bg-ac-bright)
                border-radius: 24px

                i
                    color : srgb(--text-on-bg-shadow-color)
                
    &.second
        font-size: 0.8em
        position: relative
        

@media (pointer:fine)
    .item
        +transition(0.3s)
        cursor: pointer
        &:hover
            opacity: 0.8
			

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
        second : Boolean,
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

        

    }),

    methods: {
        change : function(v){
            
            if(this.mode == 'history'){

                this.$router.replace({
                    query : {
                        ... this.$route.query,
                        ... {
                                [this.navkey] : v
                            }
                    }
                }).catch(e => {})
            }
            else{
                this.$emit('change', v)
            }

        }
    },
}
</script>
