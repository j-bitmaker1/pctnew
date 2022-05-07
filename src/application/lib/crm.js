import Queries from "./queries";

class CRM {
    constructor({api, user}){
        this.queries = new Queries()
    }

    query = function(query, p){

        return this.queries.make(query, p)

    }
}

export default CRM