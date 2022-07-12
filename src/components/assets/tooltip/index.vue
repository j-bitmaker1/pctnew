<template>
<div class="tooltip">
    <v-popover ref="tooltip" v-bind="options" v-if="!mobileview">
        <slot name="item">
            <div class="diconbutton">
                <i class="fas fa-ellipsis-v"></i>
            </div>
        </slot>

        <template v-slot:popover>
            <div class="content">
                <slot name="content" :close="close">
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

        <transition name="fademodal">
            <modal v-if="showed" @close="close" mclass="small likemenu">

                <template v-slot:body>
                    <slot name="content" :close="close">
                    </slot>
                </template>

            </modal>
        </transition>

    </div>

</div>
</template>

<style scoped lang="sass">
.content
    ::v-deep
        .simplelist
            .menuitem
                padding-left: $r
                border-radius: 12px
                i
                    margin-right: 0
                i,span
                    font-size: 0.8em
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
    data: function () {
        return {
            showed: false,

            options: {
                autoHide: true,
                placement: 'left',
                trigger : 'click',
                hideOnTargetClick : true
            }
        }
    },
    computed: mapState({
        auth: state => state.auth,

        mobileview: (state) => {
            return state.dwidth <= 768
        },

        modals: state => state.modals
    }),

    methods: {
        show: function () {
            this.showed = true

            var h = document.getElementById('html');
            h.style.overflow = 'hidden'
        },

        close: function () {
            this.showed = false

            if(this.$refs.tooltip){

                this.$refs.tooltip.hide()

            }
            else{

                if (!this.modals.length) {
                    var h = document.getElementById('html');
                    h.style.overflow = null
                }
            }

            

        }
    },
}
</script>
