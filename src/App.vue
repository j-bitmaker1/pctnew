<template>
<div id="app" :theme="theme" class="app" >
    <root/>
</div>
</template>

<style src="./editedplugins/vue-m-message/dist/index.css"></style>

<style lang="sass" src="./index.sass"></style>
<style lang="css" src="./fontawesome/css/all.css"></style>

<script>
import Vue2TouchEvents from 'vue2-touch-events'
import vuescroll from 'vue-scroll'
import store from "@/vuex/store";
import router from "@/router/router";
import modal from "@/components/assets/modal/index.vue";
import modals from "@/components/assets/modals/index.vue";
import _ from "underscore";
import VueI18n from "vue-i18n";
import Message from "@/editedplugins/vue-m-message/src/index.js";
import "@/editedplugins/vue-m-message/dist/index.css";

import VuejsDialog from "vuejs-dialog";
import VTooltip from 'v-tooltip'

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

////////

import "vuejs-dialog/dist/vuejs-dialog.min.css";

/// app

import f from "@/application/functions.js";
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
import logotype from "@/components/assets/logotype/index.vue";
import backButton from "@/components/assets/backButton/index.vue";
import search from "@/components/assets/search/index.vue";
import upload from "@/components/assets/upload/index.vue";
import linepreloader from "@/components/assets/linepreloader/index.vue";
import coloredNumber from "@/components/assets/coloredNumber/index.vue";
import list from "@/components/assets/list/index.vue";
import listgrouped from "@/components/assets/listgrouped/index.vue";
import tooltip from "@/components/assets/tooltip/index.vue"; 
import listmenu from "@/components/assets/listmenu/index.vue"; 

import listpaginated from "@/components/assets/listpaginated/index.vue";
import listcontrols from "@/components/assets/listcontrols/index.vue";
import forms from "@/components/assets/forms/index.vue";
import iconstoggle from "@/components/assets/iconstoggle/index.vue";
import value from "@/components/assets/value/index.vue";

import topheader from "@/components/layouts/topheader/index.vue";
import maincontent from "@/components/layouts/maincontent/index.vue";

import gallery from "@/components/modules/gallery/index.vue";

import root from "@/root/index.vue";

import Highcharts from 'highcharts'
import drilldownInit from 'highcharts/modules/drilldown'

drilldownInit(Highcharts)

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
Vue.component("logotype", logotype);
Vue.component("backButton", backButton);
Vue.component("search", search);
Vue.component("upload", upload);
Vue.component("linepreloader", linepreloader);
Vue.component("coloredNumber", coloredNumber);
Vue.component("iconstoggle", iconstoggle);
Vue.component("value", value);
Vue.component("listmenu", listmenu);
Vue.component("list", list);
Vue.component("listgrouped", listgrouped);
Vue.component("listpaginated", listpaginated);
Vue.component("listcontrols", listcontrols);

Vue.component("topheader", topheader);
Vue.component("maincontent", maincontent);

Vue.component("gallery", gallery);

Vue.use(VuePageTransition)

 
Vue.use(vuescroll, {throttle: 100})

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

        closeGallery: function () {
            this.$store.commit('GALLERY', null)
        },

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
	},

    created() {
        this.$store.commit("clearall");

        core = new Core(this, {});

        core.init();

        core
            .initWithUser()
            .then((r) => {})
            .catch((g) => {});


		window.addEventListener('scroll', this.tscroll)
		window.addEventListener('scroll', this.dscroll)
		window.addEventListener('resize', this.dresize)
		window.addEventListener('resize', this.tresize)
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
