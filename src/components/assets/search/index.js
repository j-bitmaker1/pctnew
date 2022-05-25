import {mapState} from 'vuex';
// TODO IGOR' SEARCH ALL COMPONENTS
import _ from 'underscore'
export default {
  name: 'search',
  props: {
    placeholder: String,
    minimize: {
      type: Boolean,
      default: false
    },

    loading : Boolean,
    activity : String,
    value : String
  },

  data: function () {

    return {
      isTyping: false,
      searchTxt: ''
    }

  },

  created: () => {

  },

  watch: {
    searchTxt : {
      handler : _.debounce(function() {

        var text = this.searchTxt
        this.$emit('search', text)

        if(this.activity && text){
          this.core.user.activity.template('searching', {
            type : this.activity,
            value : text
          })
        }
  
      }, 500)
    },

    value : function(value){
      this.searchTxt = value
    }
  },
  computed: mapState({
    auth: state => state.auth,
    pocketnet: state => state.pocketnet,
    minimized: state => state.minimized,
    active: function (state) {
      return state.active || !this.minimize
    },
  }),

  methods: {
    change : function(event){
      this.searchTxt = event.target.value

      
    },

    clear : function(event){
      this.searchTxt = ''
    }, 
 
    clickicon: function () {
      this.$refs['input'].focus()
    },

    blured: function () {
    },

    focused: function () {
    }
  },
}