import f from '@/application/functions'
import _ from 'underscore'

class Filemanager {
    constructor({api, user, store}){
       this.api = api
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

}

export default Filemanager