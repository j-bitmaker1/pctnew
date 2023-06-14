import _ from "underscore"
import f from "../../shared/functions.js"

const and = "AND"
const or = "OR"

const conditions = {
    startswith: 'startswith',
    like: 'like',
    notinlist: 'notinlist',
    inlist: 'inlist',
    eq: 'eq',
    contain: 'contain',
    between: 'between',
    exists: 'exists'
}

const join = { and, or }

class Templates {
    constructor() {

    }

    status_product = function (products) {

        console.log('products', products)

        if (!products) products = ['pct']

        return this.condition(conditions.inlist, "products", products)
    }

    status_active = function () {
        return this.condition(conditions.notinlist, "Status", ["DELETED", "INACTIVE"])
    }

    userid = function (userid) {
        return this.condition(conditions.inlist, "UserId", [userid])
    }

    type_eq = function (type) {

        return this.condition(conditions.eq, "Type", type)

    }

    customfields = function (customfield) {

        var result = []

        var mc = {
            ...this.condition(customfield.condition || 'between', customfield.id, customfield.value),
            model: "Contacts",
            custom: true,
            type: customfield.type || 'int'
        }

        if (mc.type == 'int' && !customfield.value[0]) {
            result.push({
                "condition": conditions.exists,
                "isNegative": true,
                "name": customfield.id,
                "value": [],
                "model": "Contacts",
                "custom": true,
                "type": "int"
            })
        }

        result.push(mc)

        return result
    }

    ids_inlist = function (ids) {

        return this.condition(conditions.inlist, "ID", ids)

    }

    condition = function (condition, name, values) {

        if (!_.isArray(values)) values = [values]

        return {
            condition,
            name,
            value: values
        }
    }

    search = function (value) {


        var groupOperands = []


        if (value) {

            var words = f.bw(value.toLowerCase())

            _.each(words, (w) => {

                var operands = []

                var numbers = w.replace(/[^0-9]/g, '')
                var letters = w.replace(/[^a-z]/g, '')

                if (letters.length) {
                    operands.push(this.condition(conditions.like, 'FName', letters))
                    operands.push(this.condition(conditions.like, 'LName', letters))
                    operands.push(this.condition(conditions.like, 'Email', letters))
                    operands.push(this.condition(conditions.like, 'Title', letters))

                    operands.push(this.condition(conditions.like, 'City', letters))
                    operands.push(this.condition(conditions.like, 'State', letters))
                    operands.push(this.condition(conditions.like, 'Country', letters))
                }

                if (numbers.length) {
                    if (numbers.length > 4)
                        operands.push(this.condition(conditions.like, 'Phone', numbers))

                    if (numbers.length > 2)
                        operands.push(this.condition(conditions.like, 'Zip', numbers))
                }

                groupOperands.push(operands)

            })

        }

        return groupOperands

        //return this.group(operands, join.or)

    }

    group = function (operands, join) {

        operands = _.filter(operands, (o) => {return o})

        return {
            join,
            operands
        }
    }


}

class Queries {
    constructor(core) {
        this.t = new Templates()
        this.core = core
    }

    make = function (query, p) {
        if (this[query]) return this[query](p)

        return {}
    }

    simplesearch = function ({ search, type, products, customfields = [], onlyuser = true }) {
        var groups = []


        groups.push(
            this.t.group([
                this.t.status_product(products),
                this.t.status_active(),
                onlyuser ? this.t.userid(this.core.user.info.ID) : null,
                this.t.type_eq(type),

                /*... _.map(customfields, (cf) => {
                    return this.t.customfields(cf)
                })*/

            ], join.and)
        )

        _.each(customfields, (cf) => {
            groups.push(
                this.t.group(
                    this.t.customfields(cf)
                    , join.or)
            )
        })

        if (search) {

            var soperands = this.t.search(search)

            _.each(soperands, (ops) => {
                groups.push(
                    this.t.group(ops, join.or)
                )
            })

        }

        return {
            groups,
            join: join.and
        }
    }

    byids = function ({ ids }) {
        var groups = []

        groups.push(
            this.t.group([
                this.t.ids_inlist(ids)
            ])
        )

        return {
            groups
        }
    }
}

export default Queries