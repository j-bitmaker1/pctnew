import _ from "underscore"
import f from '@/application/functions'
class VXStorage {
    //// keys {type : 'client', index : 'ID'}
    constructor(keys){

        this.storage = {}
        this.queue = []
        this.queueInterval = null

        _.each(keys, (k) => {

            this.storage[k.type] = k

        })
    }

    index(type){
        return this.storage[type].index
    }

    link(store){
        this.store = store
    }

    setcore(core){
        this.core = core
    }

    invalidateDb(obj, type){


        if(this.storage[type] && this.storage[type].invalidateDb && this.core.invalidateDb){

            if (obj[this.index(type)] && (obj.updated || obj.Modified)){
                _.each(this.storage[type].invalidateDb, (dbindex) => {

                    this.core.invalidateDb(dbindex, obj.updated || obj.Modified, {

                        type,
                        index : obj[this.index(type)]

                    }).catch(e => {
                        console.error(e)
                    })

                })
            }

            
        }
    }

    set(obj, type){
        if(!this.storage[type]) throw new Error('type')
        if(!this.store) throw new Error('notlinked')

        this.invalidateDb(obj, type)

        this.store.commit('_set_' + type, obj)

        this.clearFromQueue(this.index(type), type)


        return this.get(obj[this.index(type)], type)

    }

    update(obj, type){

        if(!this.storage[type]) throw new Error('type')
        if(!this.store) throw new Error('notlinked')

        var last = this.get(obj[this.index(type)], type)

        if(!last) return {}

        var update = _.extend(last, obj)

        return {
            updated : this.set(update, type),
            from : last
        }

    }

    sets(objs, type){

        if(!_.isArray(objs)){
            return this.set(objs, type)
        }

        return _.map(objs, (obj) => {
            return this.set(obj, type)
        })
    }

    get(index, type){
        if(!this.storage[type]) throw new Error('type')
        if(!this.store) throw new Error('notlinked')

        return this.store.state['_' + type][index] || null
    }

    invalidate(index, type){
        if(!this.storage[type]) throw new Error('type')
        if(!this.store) throw new Error('notlinked')

        this.clearFromQueue(this.index(type), type)

        this.store.commit('_invalidate_' + type, index)
    }

    invalidateMany(indexes, types){

        if(!_.isArray(indexes)) indexes = [indexes]
        if(!_.isArray(types)) types = [types]

        _.each(indexes, (i) => {
            _.each(types, (type) => {
                this.invalidate(i, type)
            })
        })
    }

    invalidateManyQueue(indexes, types){

        if(!_.isArray(indexes)) indexes = [indexes]
        if(!_.isArray(types)) types = [types]

        _.each(indexes, (i) => {
            _.each(types, (type) => {
                this.invalidateQueue(i, type)
            })
        })
    }

    invalidateQueue(index, type){
        if(!this.storage[type]) throw new Error('type')
        if(!this.store) throw new Error('notlinked')

        if(!index) return

        var obj = this.get(index, type)

        if (obj){

            if (this.storage[type].reload){

                var has = _.find(this.queue, (q) => { return index == q.index && type == q.type })

                if(!has){

                    this.queue.push({
                        index,
                        type
                    })

                }
                    

            }
                
        }
    }

    clear(){
        this.queue = []
        _.each(this.storage, (storage) => {
            this.store.commit('_delete_' + storage.type)
        })
    }

    init(){
        this.queueInterval = setInterval(() => {
            this.reloadQueue()
        }, 2000)
    }

    /// for web socket update
    clearFromQueue(index, type){
        this.queue = _.filter(this.queue, (q) => {
            return q.index != index && type != type
        })
    }

    reloadQueue(){
        var grouped = f.group(this.queue, (g) => {
            return g.type
        })

        _.each(grouped, (queue, type) => {
            
            var indexes = _.map(queue, (q) => { return q.index })
            var reload = this.storage[type].reload

            indexes = _.uniq(indexes)

            if (indexes.length && reload) {

                this.core.action(reload, indexes).catch(e => {
                    console.error(e)
                })

                
            }
            
        })

        this.queue = []
    }   

    destroy(){
        this.queueInterval = null
    }

}

export default VXStorage