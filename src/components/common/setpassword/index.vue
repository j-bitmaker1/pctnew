<template>
  <div id="setnewpassword">
    <div class="wwork">
      <div class="wcaption">
        <span>{{ $t("unsorted29.2901029") }}</span>
      </div>
    </div>

    <div class="changecnt" v-if="!loading && hash">
      <div class="item">
        <div class="label">
          <div class="wwork">
            <label for="password">{{ $t("unsorted29.2901030") }}</label>
          </div>
        </div>
        <div class="input">
          <cpassword
            :value="password"
            @input="changePassword"
            name="password"
            autocomplete="off"
            :placeholder="$t('unsorted29.2901031')"
            :toggle="true"
            :badge="false"
          />
        </div>
      </div>

      <div class="item">
        <div class="label">
          <div class="wwork">
            <label for="cpassword">{{ $t("unsorted29.2901032") }}</label>
          </div>
        </div>
        <div class="input">
          <input
            type="password"
            value=""
            @input="confirmpassword = $event.target.value"
            :value="confirmpassword"
            autocomplete="off"
            name="cpassword"
            :placeholder="$t('message.confirmyourpassword')"
          />
        </div>
      </div>

      <div class="item forbutton">
        <div class="wwork">
          <button
            :disabled="!valid"
            class="button orange small"
            @click="savepassword"
          >
            {{ $t("unsorted29.2901033") }}
          </button>
        </div>
      </div>
    </div>

    <div class="wempty" v-if="!loading && !hash">
      <div class="wwork">
        <span>{{ $t("unsorted29.2901034") }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="sass">
input
    padding: 0 3 * $r
    height: 66px
    background: $color-bg-gen
    width: 100%

.forbutton
    padding: 4 * $r 0

.input
    padding: 2 * $r 0

/deep/
    .Password__strength-meter
        border-radius: 0
    .Password__badge
        border-radius: 50px
        height: 30px
        line-height: 30px
        font-size: 0.9em
    input
        padding: 0 3 * $r
        height: 66px
        background: $color-bg-gen
        width: 100%
        border: 0
</style>

<script>
import { mapState } from "vuex";
import cpassword from "vue-password-strength-meter";

export default {
  name: "setnewpassword",
  props: {
    data: Object,
  },
  components: {
    cpassword,
  },
  data: function () {
    return {
      password: "",
      confirmpassword: "",
      hash: "",
      loading: false,
    };
  },
  computed: mapState({
    auth: (state) => state.auth,
    valid: function () {
      return this.password && this.password == this.confirmpassword;
    },
  }),

  mounted: function () {
    this.load();
  },

  methods: {
    changePassword: function (v) {
      this.password = v;
    },
    load: function () {
      this.hash = this.$route.query.hash;
      this.loading = true;

      this.$store.state.globalpreloader = true;

      this.$user
        .requestRestoreCheckHash(this.hash)
        .then((r) => {
          this.loading = false;
          this.$store.state.globalpreloader = false;
        })
        .catch((e) => {
          this.loading = false;
          this.$store.state.globalpreloader = false;
          this.hash = "";
        });
    },

    savepassword: function () {
      this.$store.state.globalpreloader = true;

      this.$user
        .setNewPassword(this.hash, this.password)
        .then((r) => {
          this.$store.state.globalpreloader = false;

          this.$store.commit("icon", {
            icon: "success",
            message: this.$i18n.t("unsorted29.2901035"),
          });

          this.$router.push("/authorization/");
        })
        .catch((e) => {
          this.$store.state.globalpreloader = false;

          this.$store.commit("icon", {
            icon: "error",
            message: this.$i18n.t("unsorted29.2901036"),
          });
        });
    },
  },
};
</script>