<template>
  <div class="page">   

    <topheader>
      <template v-slot:info>
        <span>Leads</span>
      </template>
    </topheader>

    <maincontent>

      <template v-slot:content>
        <leads />
      </template>

    </maincontent>

    
  </div>
</template>

<style scoped lang="sass">

</style>

<script>

import leads from "@/components/modules/app/leads/index.vue";

export default {
  name: 'leads_page',
  components: {
    leads

  },

  computed:{
   
  },

  methods : {
   
  },

  mounted() {
    
  }
}
</script>
