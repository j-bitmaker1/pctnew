<template>
  <div class="page">   

	<topheader back="/">
	  <template v-slot:info>
		<span>Profile</span>
	  </template>
	</topheader>

	<maincontent>
	  <template v-slot:content>
		<profile />
	  </template>
	</maincontent>

	
  </div>
</template>

<style scoped lang="sass">

</style>

<script>

import profile from "@/components/modules/profile/index.vue";

export default {
  name: 'profile_page',
  components: {
	profile
  },


  methods : {
   
  },

  mounted() {
	
  }
}
</script>
