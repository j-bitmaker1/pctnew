<template>
  <div class="page index">   

    <topheader>
      <template v-slot:info>
        <span>Home</span>
      </template>
    </topheader>

    <maincontent>
      <template v-slot:content>
        page
      </template>
    </maincontent>

    
  </div>
</template>

<style scoped lang="sass">

</style>

<script>


export default {
  name: 'page',
  components: {


  },

  computed:{
   
  },

  methods : {
   
  },

  mounted() {
    
  }
}
</script>
