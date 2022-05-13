<template>
<div class="tooltip">
    <v-popover v-if="!mobileview">
        <slot name="item">
            <div class="diconbutton">
                <i class="fas fa-ellipsis-v"></i>
            </div>
        </slot>

        <template v-slot:popover>
            <div class="content">
                <slot name="content">
                </slot>
            </div>
        </template>
    </v-popover>
    <div class="mobview" v-else>
        <div class="itemWrapper" @click="show">
            <slot name="item">
                <div class="diconbutton">
                    <i class="fas fa-ellipsis-v"></i>
                </div>
            </slot>
        </div>

        <transition name="fade">
            <modal v-if="showed" @close="close" mclass="small likemenu">

                <template v-slot:body>
                    <slot name="content">
                    </slot>
                </template>

            </modal>
        </transition>

    </div>
    
</div>
</template>

<style scoped lang="sass">
.fade-enter-active, .fade-leave-active 
    +transition(0.3s)
    /deep/
        .modal
            +transition(0.3s)

.fade-enter, .fade-leave-to
    opacity: 0

    /deep/
        .modal
            -webkit-transform: translateY(100%)
            transform: translateY(100%)

</style>

<script>
import {
    mapState
} from 'vuex';

export default {
    name: 'tooltip',
    props: {
        data: Object
    },
    data : function(){
        return {
            showed : false
        }
    },
    computed: mapState({
        auth: state => state.auth,

        mobileview: (state) => {
            return state.dwidth <= 768
        }
    }),

    methods: {
        show : function(){
            this.showed = true
        },

        close : function(){
            this.showed = false
        }
    },
}
</script>
