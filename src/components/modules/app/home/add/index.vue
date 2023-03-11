<template>
<div class="home_add">
    <tooltip v-if="!ext">
        <template v-slot:item>
            <div :class="buttonclass">
                <i class="fas fa-plus"></i>
            </div>
        </template>

        <template v-slot:content="i">
            <listmenu :items="menu" :close="i.close" />
        </template>

    </tooltip>

    <div class="ext" v-else>
        <button class="button" v-for="item in menu" @click="item.action">
            <i :class="item.icon" />
            <span>{{$t(item.text)}}</span>
        </button>
    </div>
</div>
</template>

<style scoped lang="sass">
.ext
    display: flex
    flex-wrap: wrap
    
    button
        margin-right: $r
        margin-bottom: $r

        i
            margin-right: $r
    
</style>

<script>
import {
    mapState
} from 'vuex';

export default {
    name: 'home_add',
    props: {
        ext : Boolean,
        buttonclass: {
            type: String,
            default: 'buttonpanel'
        }
    },
    computed: mapState({
        auth: state => state.auth,

        menu: function () {

            var menu = [{
                    text: 'labels.newPortfolio',
                    icon: 'fas fa-suitcase',
                    action: this.portfolio,

                    features : ['PCT']
                },
                {
                    text: 'labels.newClient',
                    icon: 'fas fa-users',
                    action: this.client,

                    features : ['CRM']
                },
                {
                    text: 'labels.newLead',
                    icon: 'fas fa-user-plus',
                    action: this.lead,

                    features : ['CRM']
                },
                {
                    text: 'campaigns.labels.newCampaign',
					icon: 'fas fa-play',
                    action: this.campaign,

                    features : ['CAMPAIGN']
                }
            ]
            

            return this.core.user.extendByFeaturesMenu(menu)

        }

    }),

    methods: {
        campaign : function(){
            this.core.campaigns.start()
        },
        portfolio: function () {
            this.$store.commit('OPEN_MODAL', {
                id: 'modal_portfolios_edit',
                module: "portfolio_edit",
                caption: "New Portfolio",

                events: {
                    edit: (data) => {
                        this.$router.push('portfolio/' + data.id).catch(e => {})
                    }
                }
            })
        },
        client: function () {
            this.core.vueapi.createContact({
                Type: "CLIENT"
            }, (data) => {

                this.$router.push('client/' + data.ID).catch(e => {})

            }, {
                caption: "New client"
            })
        },
        
        lead: function () {
            this.core.vueapi.createContact({
                Type: "LEAD"
            }, (data) => {

                this.$router.push('lead/' + data.ID).catch(e => {})

            }, {
                caption: "New lead"
            })
        }

    },
}
</script>
