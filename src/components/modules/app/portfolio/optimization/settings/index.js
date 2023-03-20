import { mapState } from 'vuex';

export default {
    name: 'optimization_settings',
    props: {
        portfolio : Object
    },

    data : function(){

        return {
            loading : false
        }

    },

    created : () => {

    },

    watch: {
        //$route: 'getdata'
    },
    computed: mapState({
        auth : state => state.auth,

        gvalues : function(){

            var values = {
                totalturnover : 100,
                maxPositionSize : 100,

                equity : [0, 100],
                fixedIncome : [0, 100],
                currency : [0, 100],
                commodity : [0, 100],
                alternatives : [0, 100],
                optimizationMode : 1

            }

            if (this.portfolio && this.portfolio.positions.length){

                _.each(this.portfolio.positions, (asset) => {
                    values[asset.ticker] = [0, 100]
                })

            }

            return values
        },

        general : function(){

            var fields = {
                grouping : {
                    general : {
                        name : "optimization.general"
                    },

                    assetClass : {
                        name : "optimization.assetClass"
                    }

                },
                schema : [
                    {
                        id : 'optimizationMode',
                        input : 'radio',
                        values : [
                            {
                                text : 'optimization.optimizationMode.shortest'
                            },
                            {
                                text : 'optimization.optimizationMode.gradual'
                            },
                        ],

                        group : 'general'
                        
                    },

                    {
                        id : 'totalturnover',
                        text : 'optimization.totalturnover',
                        input : 'slider',
                        rules : [{
                            rule : 'less_than:100',
                        }, {
                            rule : 'greater_than:0',
                        }],

                        group : 'general'
                    },
                    {
                        id : 'maxPositionSize',
                        text : 'optimization.maxPositionSize',
                        input : 'slider',
                        rules : [{
                            rule : 'less_than:100',
                        }, {
                            rule : 'greater_than:0',
                        }],

                        group : 'general'
                    },

                    {
                        id : 'equity',
                        text : 'optimization.equity',
                        input : 'slider',
                        rules : [{
                            rule : 'less_than:100',
                        }, {
                            rule : 'greater_than:0',
                        }],

                        group : 'assetClass'
                    },

                    {
                        id : 'fixedIncome',
                        text : 'optimization.fixedIncome',
                        input : 'slider',
                        rules : [{
                            rule : 'less_than:100',
                        }, {
                            rule : 'greater_than:0',
                        }],

                        group : 'assetClass'
                    },

                    {
                        id : 'currency',
                        text : 'optimization.currency',
                        input : 'slider',
                        rules : [{
                            rule : 'less_than:100',
                        }, {
                            rule : 'greater_than:0',
                        }],

                        group : 'assetClass'
                    },

                    
                    {
                        id : 'commodity',
                        text : 'optimization.commodity',
                        input : 'slider',
                        rules : [{
                            rule : 'less_than:100',
                        }, {
                            rule : 'greater_than:0',
                        }],

                        group : 'assetClass'
                    },

                    {
                        id : 'alternatives',
                        text : 'optimization.alternatives',
                        input : 'slider',
                        rules : [{
                            rule : 'less_than:100',
                        }, {
                            rule : 'greater_than:0',
                        }],

                        group : 'assetClass'
                    },


                    

                    
                ]
            }

            if (this.portfolio && this.portfolio.positions.length){
                fields.grouping.assetsBoundaries = {
                    name : "optimization.assetsBoundaries"
                }

                _.each(this.portfolio.positions, (asset) => {

                    fields.schema.push({
                        id : asset.ticker,
                        text : asset.name,
                        input : 'slider',
                        rules : [{
                            rule : 'less_than:100',
                        }, {
                            rule : 'greater_than:0',
                        }],

                        group : 'assetsBoundaries'
                    })
                    
                })
            }

            return fields
        }
    }),

    methods : {
        cancel : function(){
            this.$emit('close')
        },

        save : function(){
            this.$emit('changed')
            this.close()
        }
    },
}