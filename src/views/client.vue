<template>
<div class="page">

    <topheader back="/clients" :gray="true">
        <template v-slot:info>
            <div id="clientprofile">
                <div class="userpicWrapper">
                    <userpic :userinfo="profile" />
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
            <div class="linenavigation">
                <linenavigation :items="navigation" :navdefault="navdefault" :navkey="navkey"/>
            </div>
            <component :is="module"/>
        </template>
    </maincontent>

</div>
</template>

<style scoped lang="sass">

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
    components: {
        linenavigation,
        capacity,
        portfolios
    },

    computed: {
      
        module : function(){
            return this.active
        },

        active : function(){
            return this.$route.query[this.navkey] || this.navdefault
        },
    },

    data : function(){
        return {
            profile : {
                FName : "John",
                LName : "Doe",
                Email : "jds@gmail.com"
            },
            navigation : [
                {
                    text : 'labels.portfolios',
                    id : 'portfolios'
                },
                {
                    text : 'labels.capacity',
                    id : 'capacity'
                }
            ],

            navkey : 'p',

            navdefault : 'portfolios'
        }
    },

    methods: {

    },

    mounted() {

    }
}
</script>
