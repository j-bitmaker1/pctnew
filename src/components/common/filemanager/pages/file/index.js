import { _ } from 'core-js';
import { mapState } from 'vuex';

import filepreview from '../list/file/index.vue'
import asset from './asset/index.vue'


export default {
    name: 'filemanager_pages_file',
    props: {
        file : Object
    },

    components : {
        filepreview,
        asset
    },

    data : function(){

        return {
            loading : false,
            data : []
        }

    },

    created() {
        this.data = []

        _.each(this.task.data, (d) => {
            this.data.push(_.clone(d))
        })
    },

    watch: {
        //$route: 'getdata'
    },
    computed: mapState({
        auth : state => state.auth,
        haschanges : function(){
            return JSON.stringify(this.data) != JSON.stringify(this.task.data)
        },
        menu : function(){
			return [
				
				{
					text : 'labels.deleteitems',
					icon : 'fas fa-trash',
					action : this.deleteitems
				}

			]
		},

        hasassets : function(){
            return _.filter(this.task.data, (d) => {
                return d.Name
            }).length > 0
        },

        filtered : function(){
            return _.filter(this.data, (asset) => {
                return asset.Ticker || asset.Value > 0
            })
        },

        task : function(){
            var task = (this.core.gettasks(this.file) || {})['PARSEPORTFOLIO'] || {}

            return task
        }
    }),

    methods : {
        save : function(){
            this.core.api.tasks.update(this.task.id, this.data, {
                preloader : true,
                showStatus : true
            }).then(() => {
                this.close()
            })
        },
        cancel : function(){
            this.close()
        },
        close : function(){
            this.$emit('close')
        },

        changeAsset : function(oldasset, asset){
            this.$set(oldasset, 'Name', asset.name)
            this.$set(oldasset, 'Ticker', asset.ticker)
        },

        remove : function(oldasset){
            this.data = _.filter(this.data, (d) => {
                return d.Ticker != oldasset.Ticker && d.Value != oldasset.Value
            })
        },

        changeValue : function(asset, value){
            this.$set(asset, 'Value', value)
        },

        deleted : function(){
            this.close()
        },

        createPortfolio : function(){

            var portfolio = {
                name : this.file.info[0].FileName,
                assets : []
            }

            portfolio.assets = _.filter(_.map(this.data, (d) => {
                if(d.Name){
                    return {
                        isCovered : true,
                        ticker : d.Ticker,
                        value : Number(d.Value),
                        name : d.Name
                    }
                }
            }), (a) => {return a})
            
            this.$emit('createPortfolio', portfolio)
            this.close()
        }
    },
}