<template>
  <div class="page">   

	<topheader back="back"/>

	<maincontent>
	  <template v-slot:content>
		<changepassword />
	  </template>
	</maincontent>

	
  </div>
</template>

<style scoped lang="sass">

</style>

<script>
import changepassword from "@/components/common/changepassword/index.vue";

export default {
  name: 'changepassword_page',
  components: {
	changepassword
  },

  computed:{
   
  },

  methods : {
   
  },

  mounted() {
	
  }
}
</script>
