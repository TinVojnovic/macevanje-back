'use strict'
const User = use("App/Models/User")
const Membership = use("App/Models/Membership")
const {validate} = use('Validator')
let _ = require('lodash');

class MembershipController {
    async createManyPayments({response}){
        let users = await User.query().where('type', 'member').ids()
        let filter = await Membership.query().select("user_id").where('month', 9).andWhere('year', 2020).fetch()

        filter = _.map(filter.rows, x => {
            return x = x.user_id
        })
        users = _.differenceWith(users, filter)

        let params = _.map(users, x => {
            return ({
                user_id: x,
                month: 9,
                year: 2020
            })
        })

        const payments = await Membership.createMany(params)
        response.ok({payments})
    }

    async createPayment({request, response, params}){
        const user = await User.findOrFail(params.id)

        const allParams = await request.post()

        const validation = await validate(allParams, {
            month: 'integer|required',
            year: 'integer|required'
        })
        if(validation.fails()) return response.badRequest(validation.messages())
        
        let check = await user.payments().where("month", allParams.month).andWhere('year', allParams.year).first()

        if(check) return response.badRequest("The payment record already exists.")

        const payment = await user.payments().create({
            month: allParams.month,
            year: allParams.year
        })

        response.ok({payment})
    }

    async processPayment({ response, params }){
     
        const payment = await Membership.find(params.id)
        
        if(!payment) return response.badRequest("The membership you are trying to process doesn't exist")

        payment.merge({
            paid: true
        })
        payment.save()

        response.ok({payment})
    }

    async processManyPayments({request, response}){
        const allParams = await request.post()
        const validation = await validate(allParams, {
            ids: 'required|array',
            'ids.*':'integer'
        })
        if(validation.fails()) return response.badRequest(validation.messages())
        const payments = await Membership.query().whereIn('id', allParams.ids).update({paid: true})
        
        response.ok({payments})
    }
}

module.exports = MembershipController