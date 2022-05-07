<template>
<div id="forgotpassword">
    <div class="wwork">
        <div class="wcaption">
            <span>{{ $t("unsorted29.2901017") }}</span>
        </div>
    </div>

    <div class="resetcont" v-if="!sent">
        <div class="item">
            <div class="wscaption">
                <div class="lwork">
                    <div class="wwork">
                        <label for="iemail">
                            <span>{{ $t("unsorted29.2901018") }}</span>
                        </label>
                    </div>
                </div>
            </div>
            <div class="input">
                <input type="email" @change="changelogin" @keyup="keyuplogin" :value="login" name="email" />
            </div>
        </div>

        <div class="item forbutton">
            <div class="wwork">
                <button :disabled="!valid" class="button orange small" @click="sendrequest">
                    {{ $t("unsorted29.2901019") }} {{ via }}
                </button>
            </div>
        </div>
    </div>

    <div class="wempty" v-if="sent">
        <div class="wwork">
            <span>{{ $t("unsorted29.2901020") }} {{ check }}</span>
        </div>
    </div>
</div>
</template>

<style lang="sass" scoped>
.forbutton padding: 4 * $r 0 .input padding: 2 * $r 0 /deep/ input padding-left: 3 * $r
</style>

<script>
import {
    mapState
} from "vuex";
var PhoneValidator = require("rf-phone-validator");
var EmailValidator = require("email-validator");

export default {
    name: "forgotpassword",
    props: {
        data: Object,
    },
    data: function () {
        return {
            login: "",
            sent: false,
        };
    },
    computed: mapState({
        auth: (state) => state.auth,
        valid: function () {
            return (
                EmailValidator.validate(this.login) ||
                new PhoneValidator(this.login).valid()
            );
        },

        via: function () {
            if (new PhoneValidator(this.login).valid()) {
                return "via sms";
            }

            if (EmailValidator.validate(this.login)) return "via email";

            return "";
        },

        check: function () {
            if (new PhoneValidator(this.login).valid()) {
                return this.$i18n.t("unsorted29.2901021");
            }

            if (EmailValidator.validate(this.login))
                return this.$i18n.t("unsorted29.2901022");

            return "";
        },
    }),

    methods: {
        keyuplogin: function (v) {
            this.login = v.target.value;
        },
        changelogin: function (v) {
            this.login = v.target.value;
        },
        sendrequest: function () {
            this.$store.state.globalpreloader = true;

            this.$user
                .requestRestorePassword(this.login)
                .then((r) => {
                    this.$store.state.globalpreloader = false;

                    this.sent = true;

                    this.$store.commit("icon", {
                        icon: "success",
                        message: this.$i18n.t("unsorted29.2901023"),
                    });
                })
                .catch((e) => {
                    console.log("E", e);
                    this.$store.state.globalpreloader = false;

                    this.$store.commit("icon", {
                        icon: "error",
                        message: this.$i18n.t("unsorted29.2901024"),
                    });
                });
        },
    },
};
</script>
