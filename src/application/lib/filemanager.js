import f from '@/application/functions'
import _ from 'underscore'

class Filemanager {
    constructor({api, user, store}){
       this.api = api

       this.originals = {}
    }

    parseList(records){
        var files = []

        _.each(records, (r) => {
            var file = {
                data : {},
                info : {}
            }

            file.id = r.Id
            file.progress = f.numberParse(r.Progress || '0')
            file.status = r.Status

            if(r.Completed) file.completed = f.date.fromstring(r.Completed)
            if(r.Created) file.created = f.date.fromstring(r.Created)


            try {
                file.data = JSON.parse(r.Data || "{}").Infos || {}
                file.info = JSON.parse(r.Info || "{}")
            }
            catch (e){

            }

            files.push(file)
        })

        return files
    }

    getall(){
        return this.api.rixtrema.aws.get().then(records => {
            console.log("data", records)
            return Promise.resolve(this.parseList(records))
        })
    }

    original(id, type){


        return this.api.rixtrema.aws.original(id, type, {
            preloader : true,
            showStatusFailed : true
        }).then(file => {

            return Promise.resolve(file)
        })
    }

    upload(file){

        var info = {
            FileName: file.name,
            ContentType: file.type,
            Size: file.size
        }

        return this.api.rixtrema.aws.upload(info, file).then(r => {

            return Promise.resolve(r)
        })

    }

}

export default Filemanager