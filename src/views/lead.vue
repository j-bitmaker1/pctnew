<template>
<div class="page">

    <topheader :back="wnd ? '' : '/leads'" :gray="true">
        <template v-slot:info>
            <div id="clientprofile">
                <div class="userpicWrapper">
                    <userpic :userinfo="profile || {}" />
                </div>

                <div class="data" v-if="profile">
                    <div class="name">{{profile.FName}} {{profile.LName}}</div>
                    <div class="email">{{profile.Email}}</div>
                </div>
            </div>
        </template>
        <template v-slot:right>
            <div class="buttonpanel">
                <i class="fas fa-ellipsis-v"></i>
            </div>
        </template>
    </topheader>


    <maincontent>
        <template v-slot:content>
            <div>
                <div class="linenavigation">
                    <linenavigation @change="changenav" :items="navigation" :navdefault="navdefault" :navkey="navkey" :mode="wnd ? 'emit' : 'history'"/>
                </div>
                <component :is="module" />
            </div>
        </template>
    </maincontent>

</div>
</template>

<style lang="sass" scoped>
.linenavigation
    background: srgb(--background-secondary-theme)
    margin-bottom: $r

#clientprofile
    display: flex
    align-items: center

    .data
        .name
            font-size: 1.2em
            font-weight: 700
        .email
            font-size: 0.8em

/deep/
    .userpicWrapper
        max-width: 44px
        min-width: 44px
        width: 44px
        line-height: 44px
        font-size: 0.8em
        margin-right: 2 * $r
</style>

<script>
import linenavigation from "@/components/assets/linenavigation/index.vue";
import capacity from "@/components/modules/app/client/capacity/index.vue";
import portfolios from "@/components/modules/app/client/portfolios/index.vue";

export default {
    name: 'page',

    props : {
        wnd : Boolean,

        leadid : Number
    },

    components: {
        linenavigation,
        capacity,
        portfolios
    },

    computed: {

        module: function () {
            return this.active
        },

        active: function () {
            return this.$route.query[this.navkey] || this.navdefault
        },

        id : function(){
            return this.leadid || this.$route.params.id
        },


    },

    data: function () {
        return {
            profile: {},
            loading : true,

            navkey: 'p',
            navdefault: 'capacity',

            navigation : [
                {
                    text: 'labels.capacity',
                    id: 'capacity'
                }
            ]
        }
    },

    methods: {
        load: function () {
            this.loading = true

            this.core.api.crm.contacts.get(this.id).then(r => {

                this.profile = r


                return Promise.resolve(r)
            }).finally(() => {
                this.loading = false
            })
        },

        changenav : function(v){
            this.navdefault = v
        }
    },

    created() {
        
    },

    mounted() {
        this.load()
    }
}
</script>
