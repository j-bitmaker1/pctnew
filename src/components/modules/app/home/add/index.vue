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
        <button class="button small" :class="(i ? 'black' : '') + ' ' + (item.style || '')" v-for="(item, i) in menu" @click="item.action">
            <i v-if="item.icon" :class="item.icon"/>
            <img :src="require('@/assets/' + item.svg)" v-if="item.svg"/>
            <span>{{$t(item.text)}}</span>
        </button>
    </div>
</div>
</template>

<style scoped lang="sass">
.ext
    display: flex
    align-items: center
    flex-wrap: nowrap
    white-space: nowrap
    
    button
        display: flex
        align-items: center
        margin-right: $r
        justify-content: center

        span
            margin-bottom: 2px

        &.aibutton
            justify-content: flex-start

        img
            height: 18px
            margin-right: 2px

        i
            margin-top: 2px
            font-size: 0.8em
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
        },

        success : Boolean
    },
    computed: mapState({
        auth: state => state.auth,

        mobileview : state => state.mobileview,
        menu: function () {

            var menu = [{
                    text: 'labels.newPortfolio',
                    icon: 'fas fa-plus',
                    action: this.portfolio,
                    features : ['PCT']
                },
                {
                    svg : "logoai.svg",
                    text: 'menu.ai',
                    action: this.openai,
                    style : 'aibutton',
                    features : ['AI']
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
                },

                {
                    text: 'menu.questionnaire',
                    icon: 'fas fa-link',

                    action: this.sharequestionnaire,
                    features : ['PCT']
                },

                
                
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
                        if (this.success){
                            this.success('portfolio', data.id)
                        }
                        else{

                            if (this.mobileview){
                                this.$router.push('/portfolio/' + data.id).catch(e => {})
                            }
                            else{
                                this.$router.push('/summary?id=' + data.id).catch(e => {})
                            }

                        }
                        
                    }
                }
            })
        },

        sharequestionnaire : function(){
			this.core.vueapi.sharequestionnaire()
		},

        client: function () {
            this.core.vueapi.createContact({
                Type: "CLIENT"
            }, (data) => {

                if (this.success){
                    this.success('client', data.id)
                }
                else{
                    this.$router.push('client/' + data.ID).catch(e => {})

                }


            }, {
                caption: "New client"
            })
        },
        
        lead: function () {
            this.core.vueapi.createContact({
                Type: "LEAD"
            }, (data) => {

                if (this.success){
                    this.success('lead', data.id)
                }
                else{
                    this.$router.push('lead/' + data.ID).catch(e => {})

                }

            }, {
                caption: "New lead"
            })
        },

        openai : function(){
			this.core.vueapi.openai()
		}

    },
}
</script>
