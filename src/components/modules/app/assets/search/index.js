import { mapState } from 'vuex';

export default {
    name: 'assets_search',
    props: {
        value : String,
        nfb : Boolean
    },

    data : function(){

        return {
            loading : false,
            searchvalue : '',
            searchresult : [],
            tipposition : 0
        }

    },

    mounted (){

        this.searchvalue = this.value || ''

        setTimeout(() => {

            if (this.value){
                this.search(this.value)
            }

            if(!this.nfb)

                if (this.$refs.search)
                    this.$refs.search.focus()
        }, 50)
        
    },

    watch: {
        //$route: 'getdata'
    },
    computed: mapState({
        auth : state => state.auth,
    }),

    methods : {
        search : function(v){

            this.searchvalue = v

            this.$emit('search', v)

            if(!this.searchvalue) return this.setResult([])

            this.loading = true

            this.core.api.pctapi.assets.search({
                searchStr : this.searchvalue
            }).then(r => {
                this.loading = false
                return this.setResult(_.first(r || [], 11))

            }).catch(e => {
                console.error(e)
            })
        },

        searchMultiple(assets){
            this.$store.commit('globalpreloader', true)

            var result = []

            return Promise.all(_.map(assets, (a) => {

                return this.core.api.pctapi.assets.search({
                    searchStr : a.search
                }).then(r => {

                    if(r.length){
                        var rs = _.clone(r[0])

                        rs.value = a.value
                        rs.isCovered = true

                        result.push(rs)
                    }

                }).catch(e => {
                    console.error(e)
                })

            })).then(() => {

                this.$emit('multiple', result)

                this.$store.commit('globalpreloader', false)

                this.$emit("close")
            })

        },

        setResult : function(r){
            this.searchresult = r

            this.setTipPosition()
        },

        setTipPosition : function(v){

            if(typeof v != 'undefined') this.tipposition = v

            if(this.tipposition >= this.searchresult.length) this.tipposition = this.searchresult.length - 1

            if(this.tipposition < 0) this.tipposition = 0
            
        },

        select : function(asset){
            this.$emit("selected", asset)
            this.$emit("close")
        },

        controlKey : function(key){
            if(!this.searchresult.length) return

            if (key == 'up')
                this.setTipPosition(this.tipposition - 1)

            if (key == 'down')
                this.setTipPosition(this.tipposition + 1)

            if (key == 'enter')
                this.select(this.searchresult[this.tipposition])
        },

        paste : function(evt){
            var assets = this.core.pct.parseText(evt.clipboardData.getData('text'))

			if(assets.length){

				this.searchMultiple(assets)

                evt.preventDefault()

				return false
			}
            
        }
    },
}