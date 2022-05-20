<template>
  <div id="movingcontainer">
  </div>
</template>

<style scoped lang="sass">

</style>

<script>
import { mapState } from 'vuex';

export default {
    name: 'movingcontainer',
    props: {
        data : Object
    },
    computed: mapState({
        auth : state => state.auth,
    }),

    methods : {
        
    },
}
</script>