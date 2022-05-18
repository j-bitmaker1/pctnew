import _ from "underscore"

class VXStorage {
    //// keys {type : 'client', index : 'ID'}
    constructor(keys){

        this.storage = {}

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

    set(obj, type){
        if(!this.storage[type]) throw new Error('type')
        if(!this.store) throw new Error('notlinked')

        this.store.commit('_set_' + type, obj)

        return this.get(obj[this.index(type)], type)

    }

    update(obj, type){
        if(!this.storage[type]) throw new Error('type')
        if(!this.store) throw new Error('notlinked')

        var last = this.get(obj[this.index(type)], type)

        if(!last) throw new Error('last')

        last = _.extend(last, obj)

        return this.set(obj, type)

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

        this.store.commit('_invalidate_' + type, index)
    }

    clear(){
        _.each(this.storage, (storage) => {
            this.store.commit('_delete_' + storage.type)
        })
    }

}

export default VXStorage