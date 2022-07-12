<template>
  <div class="bgpage">
	<!---->
	<div class="authorizationWrapper">
		<div class="brandWrapper">
		<logotype />
	</div>
	  	<authorization />
	</div>
  </div>
</template>

<style scoped lang="sass">
		
	.authorizationWrapper
		max-width: 540px
		margin: 0 auto
		border-radius: 6px
		border: 1px solid srgb(--neutral-grad-0)
		padding: 4 * $r
		background: srgb(--background-total-theme)

	.brandWrapper
		margin-bottom: 4 * $r

	@media only screen and (max-width: 768px)
		.brandWrapper
			padding-left: 0
			margin-top : 4 * $r
			margin-bottom: 4 * $r
			display: block

		.authorizationWrapper
			max-width: none
			border : 0
			padding : 0
</style>

<script>
import authorization from "@/components/common/authorization/index.vue";

export default {
  name: "authorization_page",
  components: {
	authorization,
  },

  computed: {},

  methods: {},

  mounted() {},
};
</script>
