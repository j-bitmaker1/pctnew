import { mapState } from 'vuex';

export default {
    name: 'portfolio_assets_difference',
    props: {
        portfolio : Object,
        optimized: Object
    },

    data : function(){

        return {
            loading : false,

            indexes : ['added', 'removed', 'changed', 'notchanged']
        }

    },

    created : () => {

    },

    watch: {
        //$route: 'getdata'
    },
    computed: mapState({
        auth : state => state.auth,

        composed(){
            var assets = []

            _.each(this.optimized.positions, (asset) => {
                var a = {...asset}

                a.curvalue = asset.value

                var prevasset = _.find(this.portfolio.positions, (ass) => {
                    return asset.ticker == ass.ticker
                })

                if (prevasset){ 

                    a.prevvalue = prevasset.value

                    if (prevasset.value == asset.value) {
                        a.notchanged = true
                    }
                    else{

                        if (asset.value <= 0){
                            a.removed = true
                        }
                        else{
                            a.changed = true
                        }
                       
                    }
                }

                else{
                    a.prevvalue = 0
                    a.added = true
                }

                assets.push(a)
            })

            _.each(this.portfolio.positions, (asset) => {

                if(!_.find(assets, (ass) => {
                    return ass.ticker == asset.ticker
                })){
                    var a = {...asset}

                    a.curvalue = 0
                    a.prevvalue = a.value

                    a.removed = true

                    assets.push(a)
                }

            })

            return assets
        },

        cgroupped () {
            return {
                changed : _.filter(this.composed, (a) => {
                    return a.changed
                }),
        
                added: _.filter(this.composed, (a) => {
                    return a.added
                }),
        
                removed : _.filter(this.composed, (a) => {
                    return a.removed
                }),
        
                notchanged : _.filter(this.composed, (a) => {
                    return a.notchanged
                })
            }
            
        }   

        
    }),

    methods : {
        
    },
}