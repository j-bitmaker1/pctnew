import f from '@/application/functions'
import _ from 'underscore'

class Settings {

    product = 'PCT_NEW'

    meta = {
        scenarios : {
            
            name : 'scenarios',
            default : function(){
                return []
            },

            group : 'stresstest'
        },

        useKeyScenarios : {
            name : 'useKeyScenarios',
            default : function(){
                return true
            },

            group : 'stresstest'
        }
    }

    constructor({api}){
        this.api = api
        this.data = null
    }

    set(name, value){
        var s = this.get(name)

        if(!s) return Promise.reject('none')

        s.value = value

        if (s.id){
            return this.api.user.settings.update(id, name, value)
        }
        else{
            return this.api.user.settings.create(name, value).then(r => {

                this.data = {
                    ...this.data,
                    ...this.parse([r])
                } 
    
                return Promise.resolve(this.data)
            })
        }
    }

    parse(r){
        var d = {}

        _.each(r, (r) => {

            if(!this.meta[r.Name]) return
            if(r.Product != this.product) return

            try{

                var setting = {
                    id : r.Id,
                    name : r.Name,
                    value : JSON.stringify(r.Info),
                    default : this.meta[r.Name].default(),
                    group : this.meta[r.Name].group
                }

                d[setting.name] = setting

            }catch(e){}
            
           
        })

        return d
    }

    get(name){

        if(!this.data || !this.meta[name]) return null

        if(!this.data[name]) return {
            name : name,
            value : this.meta[name].default(),
            default : this.meta[name].default(),
            group : this.meta[name].group,
            id : null
        }

        return this.data[name]
    }

    getall(){

        if(this.data) return Promise.resolve(this.data)

        return this.api.user.settings.getall().then(r => {
            this.data = this.parse(r)

            return Promise.resolve(this.data)
        })

    }

}

export default Settings