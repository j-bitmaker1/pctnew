import f from '@/application/shared/functions.js'
import _ from 'underscore'

class Filesystem {
    constructor(core){
       this.core = core
    }


    portfolioToFsObject(portfolio){
        return {
            type : 'portfolio',
            id : portfolio.id,
            name : portfolio.name,
            context : 'filesystem',
            from : portfolio.catalogId
        }
    }

    move(moving, to){

        var haserrors = 0
        var l = moving.length

        return Promise.all(_.map(moving, (item) => {

            var nameexist = _.find(to.content, (c) => {
                return item.type == c.type && item.name == c.name
            })

            if (nameexist){

                this.core.notifier.simplemessage({
                    icon : "fas fa-exclamation-triangle",
                    title : "Name exist",
                    message : item.name + " exist in this folder"
                })

                haserrors++
                
                return Promise.resolve()
            }

            return this.core.api.filesystem.move[item.type]({
                id : item.id,
                to : to.id,
                from : item.from
                //from : this.current.id /// ?
            })

        })).then(r => {

            moving = null

            if(haserrors == l){
                return Promise.reject({
                    error : "Operation failed"
                })
            }

            if(!haserrors){
                this.core.store.commit('icon', {
                    icon: 'success'
                })
            }
            else{
                this.core.store.commit('icon', {
                    icon: 'warning',
                    message : 'The operation was partially successful'
                })
            }
            
            return Promise.resolve()

        }).catch(e => {

            console.error(e)

            return Promise.reject(e)
        })
    }

}

export default Filesystem