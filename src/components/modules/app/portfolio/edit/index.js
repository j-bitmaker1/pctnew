import { mapState } from 'vuex';
import assetsEdit from "@/components/modules/app/assets/edit/index.vue";
import f from '@/application/functions'
import _ from 'underscore';
var sha1 = require('sha1');

export default {
    name: 'portfolios_edit',
    props: {
        edit : Object
    },

    components : {
        assetsEdit
    },

    data : function(){

        return {
            loading : false,
            mincount : 9,
            assets : [],
            hash : '',
            name : ''
        }

    },

    created : function() {

        console.log('this.edit', this.edit)

        if (this.edit){
            this.assets = []
            
            _.each(this.edit.assets, (e) => {
                this.assets.push(_.clone(e))
            })

            this.name = this.edit.name
        }

        this.hash = this.datahash()
        
    },

    mounted : function(){
        this.$refs.assetsList.scrollLeft = 100
    },

    watch: {
        //$route: 'getdata'
    },
    computed: mapState({
        auth : state => state.auth,
        total : function(){
            return _.reduce(this.assets, (m, asset) => {
                return m + asset.value
            }, 0)
        },
        extended : function(){
            var diff = Math.max(this.mincount - this.assets.length, 0) + 1

            var extended = _.clone(this.assets)

            for(var i = 0; i < diff; i++){
                extended.push({
                    ticker : '',
                    name : '',
                    value : 0,
                    ID : f.makeid()
                })
            }

            return extended
        },

        validate : function(){
            if(!this.total) return 'total'
            if(!this.name) return 'name'
        },

        haschanges : function(){
            return this.datahash() != this.hash
        }
    }),

    methods : {
        datahash : function(){

            return sha1(this.name + JSON.stringify(_.map(this.assets, (asset) => {
                return {
                    ticker : asset.ticker,
                    value : asset.value
                }
            })))

        },
        cancel : function(){
            if (this.haschanges){ /// check changes instead

                return this.$dialog.confirm(
					'You have unsaved changes, close the window and forget?', {
					okText: 'Yes, close',
					cancelText : 'No'
				})
		
				.then((dialog) => {
					
					this.$emit('close')

				}).catch( e => {
					
				})

            }

            this.$emit('close')
        },
        save : function(){
            if (this.validate){

                this.$store.commit('icon', {
                    icon: 'error',
                    message: 'Validation Error'
                })

                return
            }

            var action = null
            var positions = this.joinassets(this.assets)

            if(this.edit){

                action = this.core.api.pctapi.portfolios.update({
                    name : this.name,
                    positions,
                    id : this.edit.id
                })
            }
            else{

                action = this.core.api.pctapi.portfolios.add({
                    name : this.name,
                    positions,
                })
               
            }

            this.$store.commit('globalpreloader', true)

            action.then(r => {

                this.$store.commit('icon', {
                    icon: 'success',
                })

                this.$emit('close')

            }).catch((e = {}) => {

                console.log("E", e)

                this.$store.commit('icon', {
                    icon: 'error',
                    message: e.error
                })
                
            }).finally(() => {
                this.$store.commit('globalpreloader', false)
            })

            //this.$emit('save', this.assets)

            
        },
        assetchanged : function(index, v){
            var old = this.assets[index]
            var af = false

            if(!old){

                af = true

                if (v.ticker && v.name)
                    this.assets.push({
                        ticker : v.ticker,
                        name : v.name,
                        value : v.value || 0
                    })
            }
            else{
                old = _.extend(old, v)

                if(index == this.assets.length - 1) af = true
            }

            if (af)
                setTimeout(() => {
                    this.autofocus()
                })
            
        },

        remove : function(index){
            if (this.assets[index]){
                this.assets.splice(index, 1)
            }
        },

        autofocus : function(){
            var assetindex = this.assets.length - 1

            if (this.assets[assetindex] && this.assets[assetindex].value){
                assetindex++
            }

            if (this.$refs[assetindex])
                this.$refs[assetindex].autofocus()

        },

        changename : function(e){
            this.name = e.target.value
        },
        joinassets : function(assets){
            var jg = {}

            _.each(assets, (a) => {
                if(!jg[a.ticker]){
                    jg[a.ticker] = a 
                }
                else{
                    jg[a.ticker].value += a.value
                }
            })
            
            return _.toArray(jg)
        },
    },
}