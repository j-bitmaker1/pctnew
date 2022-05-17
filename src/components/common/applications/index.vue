<template>
  <div class="applications">

	<div class="applicationsContent">

		<div class="wwork">

			<div class="wcaption">
				<span>{{ $t("unsorted29.2901002") }}</span>
			</div>

			<div class="apps">
				<a href="https://apps.apple.com/us/app/id1530556224">
					<img src="/img/badge-download-on-the-app-store.svg">
				</a>
				<a href="https://play.google.com/store/apps/details?id=health.wellai.assistant">
					<img src="/img/googleplaybadge.png">
				</a>
			</div>

		</div>

	</div>

  </div>
</template>
<style scoped lang="sass">

	.apps
		padding : 6 * $r 0
		img
			margin-right: $r

	.applicationsContent
		padding : 8 * $r
		padding-left : 0


</style>
<script>



// @ is an alias to /src

export default {
  name: 'applications',
  components: {
	
  },

  computed : {
	
  },

  methods : {
   
  }
}
</script>
