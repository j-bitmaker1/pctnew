<template>
<div id="app" :theme="theme" class="app" >
    <root/>
</div>
</template>

<style src="./editedplugins/vue-m-message/dist/index.css"></style>

<style lang="sass" src="./index.sass"></style>

<script>
import Vue2TouchEvents from 'vue2-touch-events'
import vuescroll from 'vue-scroll'
import VXStorage from '@/application/shared/vxstorage'
import storeFactory from "@/vuex/store";
import router from "@/router/router";
import modal from "@/components/assets/modal/index.vue";
import modals from "@/components/assets/modals/index.vue";
import _ from "underscore";
import VueI18n from "vue-i18n";
import Message from "@/editedplugins/vue-m-message/src/index.js";
import "@/editedplugins/vue-m-message/dist/index.css";

import VuejsDialog from "vuejs-dialog";
import VTooltip from 'v-tooltip'
import VueIframe from 'vue-iframes'
////////

Vue.use(Vue2TouchEvents, {
    disableClick: false,
    touchClass: '',
    tapTolerance: 10,
    touchHoldTolerance: 400,
    swipeTolerance: 30,
    longTapTimeInterval: 400,
    namespace: 'touch'
})
Vue.use(VuejsDialog);
Vue.use(VTooltip)
Vue.use(Message);
Vue.use(VueI18n);
Vue.use(VueIframe);


////////

import "vuejs-dialog/dist/vuejs-dialog.min.css";

/// app

import f from "@/application/shared/functions.js";
import Vue from "vue";
import Core from "@/application/index.js";
import VuePageTransition from 'vue-page-transition'

////////

Vue.config.productionTip = false;
Vue.prototype._ = _;
Vue.prototype.$f = f;

if (!window._) window._ = _;

import preloader from "@/components/assets/preloader/index.vue";
import fixedmessageicon from "@/components/assets/fixedmessageicon/index.vue";
import date from "@/components/assets/date/index.vue";
import userpic from "@/components/assets/user/userpic/index.vue";
import userspic from "@/components/assets/user/userspic/index.vue";
import bgimage from "@/components/assets/bgimage.vue";
import sticker from "@/components/assets/sticker.vue";
import datepicker from "@/components/assets/datepicker/index.vue";

import logotype from "@/components/assets/logotype/index.vue";
import backButton from "@/components/assets/backButton/index.vue";
import search from "@/components/assets/search/index.vue";
import upload from "@/components/assets/upload/index.vue";
import linepreloader from "@/components/assets/linepreloader/index.vue";
import coloredNumber from "@/components/assets/coloredNumber/index.vue";
import list from "@/components/assets/list/index.vue";
import listgrouped from "@/components/assets/listgrouped/index.vue";
import listgroupedsliced from "@/components/assets/listgroupedsliced/index.vue";
import tooltip from "@/components/assets/tooltip/index.vue"; 
import listmenu from "@/components/assets/listmenu/index.vue"; 
import swipable from "@/components/assets/swipable/index.vue"; 

import listselectable from "@/components/assets/listselectable/index.vue";
import listpaginated from "@/components/assets/listpaginated/index.vue";
import selection from "@/components/assets/selection/index.vue";
import listcontrols from "@/components/assets/listcontrols/index.vue";
import forms from "@/components/assets/forms/index.vue";
import iconstoggle from "@/components/assets/iconstoggle/index.vue";
import checkboxtoggle from "@/components/assets/checkboxtoggle/index.vue";

import value from "@/components/assets/value/index.vue";
import avalue from "@/components/assets/avalue/index.vue";


import tags from "@/components/assets/tags/index.vue";

import topheader from "@/components/layouts/topheader/index.vue";
import maincontent from "@/components/layouts/maincontent/index.vue";

import gallery from "@/components/modules/gallery/index.vue";

import root from "@/root/index.vue";

import Highcharts from 'highcharts'
import drilldownInit from 'highcharts/modules/drilldown'
import HighchartsMore from 'highcharts/highcharts-more'
import Exporting from 'highcharts/modules/exporting'
import OfflineExporting from 'highcharts/modules/offline-exporting'
import SolidGaude from 'highcharts/modules/solid-gauge'

import campaignsStepsList from "@/components/modules/campaigns/steps/list/index.vue";

drilldownInit(Highcharts)
HighchartsMore(Highcharts)
Exporting(Highcharts)
OfflineExporting(Highcharts)
SolidGaude(Highcharts)

import plugin, {Editor} from 'vue-editor-js/src/index'
Vue.use(plugin)



/*
import { Swipeable } from 'vue-swipeable';
Vue.directive('swipeable', Swipeable);*/
Vue.component("swipable", swipable);
Vue.component("modal", modal);
Vue.component("modals", modals);
Vue.component("forms", forms);
Vue.component("tooltip", tooltip)
Vue.component("preloader", preloader);
Vue.component("date", date);
Vue.component("userpic", userpic);
Vue.component("userspic", userspic);
Vue.component("fixedmessageicon", fixedmessageicon);
Vue.component("bgimage", bgimage);
Vue.component("sticker", sticker);
Vue.component("datepicker", datepicker);


Vue.component("logotype", logotype);
Vue.component("backButton", backButton);
Vue.component("search", search);
Vue.component("upload", upload);
Vue.component("linepreloader", linepreloader);
Vue.component("coloredNumber", coloredNumber);
Vue.component("iconstoggle", iconstoggle);
Vue.component("checkboxtoggle", checkboxtoggle);

Vue.component("value", value);
Vue.component("avalue", avalue);
Vue.component("listmenu", listmenu);
Vue.component("list", list);
Vue.component("listgrouped", listgrouped);
Vue.component("listgroupedsliced", listgroupedsliced);

Vue.component("listpaginated", listpaginated);
Vue.component("listselectable", listselectable);
Vue.component("selection", selection);
Vue.component("tags", tags);

Vue.component("listcontrols", listcontrols);

Vue.component("topheader", topheader);
Vue.component("maincontent", maincontent);

Vue.component("gallery", gallery);


Vue.component("campaignsStepsList", campaignsStepsList);


Vue.use(VuePageTransition)

 
Vue.use(vuescroll, {throttle: 100})

import shadow from 'vue-shadow-dom'
Vue.use(shadow)

/////////////////////////

Vue.directive("click-outside", {
    bind: function (el, binding, vnode) {
        el.clickOutsideEvent = function (event) {
            if (!(el == event.target || el.contains(event.target))) {
                vnode.context[binding.expression](event);
            }
        };
        document.body.addEventListener("click", el.clickOutsideEvent);
    },
    unbind: function (el) {
        document.body.removeEventListener("click", el.clickOutsideEvent);
    },
});

/////////////////////////


import 'vue-slider-component/theme/antd.css'


function loadMessages() {
    const context = require.context("./locales", true, /[a-z0-9-_]+\.json$/i);

    const messages = context
        .keys()
        .map((key) => ({
            key,
            locale: key.match(/[a-z0-9-_]+/i)[0]
        }))
        .reduce(
            (messages, {
                key,
                locale
            }) => ({
                ...messages,
                [locale]: context(key),
            }), {}
        );

    return {
        context,
        messages
    };
}

const {
    context,
    messages
} = loadMessages();

const i18n = new VueI18n({
    locale: "en",
    messages: messages,
    silentTranslationWarn: true,
});

///
var core = null;
var vxstorage = new VXStorage([{
    type : "client",
    index : "ID",
    reload : 'api.crm.contacts.getbyids'
}, /*{
    type : "lead",
    index : "ID",
    reload : 'api.crm.contacts.getbyids'
},*/ {
    type : "batch",
    index : "Id",
    reload : 'api.campaigns.getbyids'
},{
    type : "step",
    index : "id"
},{
    type : "template",
    index : "Id"
    
},{
    type : "emailtemplate",
    index : "Id"
},
{
    type : "campaign",
    index : "Id",
    reload : 'api.campaigns.getbyids'
},{
    type : "portfolio",
    index : "id",
    reload : 'api.pctapi.portfolios.gets',
    invalidateDb : ['stress']

}, {
    type : "task",
    index : "id",
},
{
    type : "customscenario",
    index : "id",
    reload : 'api.pctapi.customscenarios.gets',
    invalidateDb : ['stress']
},
{
    type : 'filesystem',
    index : 'id',
    reload : 'api.pctapi.portfolios.gets'
}])

var store = storeFactory(vxstorage)

    vxstorage.link(store)

var g = {
    install: function (Vue) {
        Object.defineProperty(Vue.prototype, "core", {
            get() {
                return core;
            },
        });
    },
};

Vue.use(g);

var availableLocales = {
    en: true,
};

export default {
    i18n,
    store,
    router,
    name: "App",
    components: {
        root
    },

    computed: {

        theme: function () {
            return this.$store.state.theme;
        },

        share: function () {
            if (!this.unauthorized) return this.$store.state.share;
        },
    },

    methods: {

		tscroll : _.throttle(function(){
			this.$store.commit('tscrolly', window.scrollY)
			this.$store.commit('tscrollx', window.scrollX)
		}, 200),

		dscroll : _.debounce(function(){
			this.$store.commit('dscrolly', window.scrollY)
			this.$store.commit('dscrollx', window.scrollX)
		}, 300),

		tresize : _.throttle(function(){
			this.$store.commit('theight', window.innerHeight)
			this.$store.commit('twidth', window.innerWidth)
		}, 200),

		dresize : _.debounce(function(){
			this.$store.commit('dheight', window.innerHeight)
			this.$store.commit('dwidth', window.innerWidth)
		}, 300)
    },

    beforeRouteLeave(to, from, next) {
        this.$store.commit('setmodal', null)
        next()
    },

    beforeCreate() {
        this.$store.commit("init");
    },

	beforeDestroy(){
		window.removeEventListener('scroll', this.tscroll)
		window.removeEventListener('scroll', this.dscroll)

		window.removeEventListener('resize', this.dresize)
		window.removeEventListener('resize', this.tresize)

        vxstorage.destroy()
	},

    created() {
        this.$store.commit("clearall");

        core = new Core(this, {vxstorage, i18n});

        core.init();

        core
            .initWithUser()
            .then((r) => {})
            .catch((g) => {});

        core.api.prepare()
        core.cordovakit.prepare()

        vxstorage.setcore(core)
        vxstorage.init()

		window.addEventListener('scroll', this.tscroll)
		window.addEventListener('scroll', this.dscroll)
		window.addEventListener('resize', this.dresize)
		window.addEventListener('resize', this.tresize)

        this.tscroll()
        this.dscroll()
        this.dresize()
        this.tresize()

    }
};

if (module.hot) {
    module.hot.accept(context.id, () => {
        const {
            messages: newMessages
        } = loadMessages();

        Object.keys(newMessages)
            .filter((locale) => messages[locale] !== newMessages[locale])
            .forEach((locale) => {
                messages[locale] = newMessages[locale];
                i18n.setLocaleMessage(locale, messages[locale]);
            });
    });
}
</script>
