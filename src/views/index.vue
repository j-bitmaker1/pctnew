<template>
  <div class="page index">   

    <topheader>
      <template v-slot:info>
        <span>Home</span>
      </template>
    </topheader>

    <maincontent>
      <template v-slot:content>
        <home />
      </template>
    </maincontent>

    
  </div>
</template>

<style scoped lang="sass">

</style>

<script>

import home from "@/components/modules/app/home/index.vue";

export default {
  name: 'home_page',
  components: {
    home
  },

  computed:{
   
  },

  methods : {
   
  },

  mounted() {
    
  }
}
</script>
