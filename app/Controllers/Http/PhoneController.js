'use strict'

const User = use("App/Models/User")
const Phone = use("App/Models/Phone")
const { validate, sanitize  } = use('Validator')

class PhoneController {
    async create({ request, response, params }){
        const user = await User.findOrFail(params.id)
        
        const allParams = request.post()

        const validation = await validate(allParams, {
            number: 'required|integer',
        })

        if(validation.fails()) return response.badRequest(validation.messages())

        const phone = await user.phones().create({
            number: allParams.number
        })

        response.ok({phone})
    }

    async update({ params, request, response }){
        const phone = await Phone.findOrFail(params.id)

        const allParams = request.post()

        const validation = await validate(allParams, {
            number: 'integer'
        })

        if(validation.fails()) return response.badRequest(validation.messages())
        
        phone.merge({
            number: allParams.number
        })
        await phone.save()

        response.ok({phone})
    }

    async delete({request, response}){

        const allParams = request.post()

        const validation = await validate(allParams, {
            ids: 'required|array',
            'ids.*':'integer' 
        })

        if(validation.fails()) return response.badRequest(validation.messages())

        if(allParams.ids.length > 1){
            await Phone
            .query()
            .whereIn('id', allParams.ids )
            .delete()

        }else if(allParams.ids.length == 1){
            const phone = await Phone.find(allParams.ids)
            await phone.delete();

        }else response.notFound()
    }
}

module.exports = PhoneController
