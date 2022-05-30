
export default {
  name: 'user_userpic',
  props: {
    userinfo: {
      type : Object,
      default : {}
    },
    status : '',

    
  },

  data : function(){
    return {
    }
  },

  methods : {

  },

  computed : {
    image : function(){
      if (this.userinfo.AvatarId && this.userinfo.CompanyID){
          var imageid = this.userinfo.AvatarId.split('.')[1]

          return 'https://rixtrema.net/api/crm/attachments/download/'+this.userinfo.CompanyID+'/' + imageid
      }

      if(this.userinfo.image) return this.userinfo.image
    }
  }
}
