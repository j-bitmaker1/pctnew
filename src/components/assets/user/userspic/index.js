import many from '@/components/assets/user/userspic/many.vue'
import _ from "underscore";

export default {
  name: 'user_userspic',
  props: {
    users: Array,
    single: {},
    unseen: Number,
    slidesPerView: Number,
    status : {
      type : Object,
      default : {}
    }
 
  },

  data : function(){
    return {}
  },
  components: {
    many
  },

}
