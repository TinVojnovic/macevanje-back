'use strict'

const User = use("App/Models/User")
const Email = use("App/Models/Email")
const { validate, sanitize  } = use('Validator')

class EmailController {
    async create({ request, response, params}) {
        const user = await User.findOrFail(params.id)

        const allParams = sanitize(request.post(), {
            mail: 'normalize_email'
        })

        const validation = await validate(allParams, {
            mail: 'required|email|unique:users,email',
            is_main: 'boolean'
        })
        if (validation.fails()) return response.badRequest(validation.messages())

        const current_main = await user.emails().where('is_main', true).first()

        const email = await user.emails().create({
            mail: allParams.mail
        })

        if (allParams.is_main != null) {
            if (allParams.is_main && !email.is_main) {
                user.merge({
                    email: email.mail
                })
                await user.save()

                current_main.merge({
                    is_main: false
                })
                await current_main.save()

                email.merge({
                    is_main: true
                })
                await email.save()
            } else if (!allParams.is_main && email.is_main) return response.badRequest(validation.messages("The user must have at least 1 main mail"))
        }

        response.ok({ email })
    }

    async update({request, response, params}){
        const allParams = sanitize(request.post(), {
            mail: 'normalize_email'
        })

        const validation = await validate(allParams, {
            mail: 'email|unique:users,email',
            is_main: 'boolean'
        })

        if(validation.fails()) return response.badRequest(validation.messages())

        const email = await Email.findOrFail(params.id)
        const user = await User.findOrFail(email.user_id)
        const current_main = await user.emails().where('is_main', true).first()

        if(allParams.mail){
            email.merge({
                mail: allParams.mail
            })
            await email.save()
            if(email.is_main){
                user.merge({
                    email: allParams.mail
                })
                await user.save()
            }
        }

        if(allParams.is_main != null){
            if(allParams.is_main && !email.is_main){
                current_main.merge({
                    is_main: false
                })
                await current_main.save()

                email.merge({
                    is_main: true
                })
                await email.save()
            }else if(!allParams.is_main && email.is_main) return response.badRequest(validation.messages("The user must have at least 1 main mail"))
        }

        response.ok({email})
    }

    async delete({request, response}){
        const allParams = request.post()
        const validation = await validate(allParams, {
            ids: 'required|array',
            'ids.*':'integer' 
        })
        if(validation.fails()) return response.badRequest(validation.messages())

        if(allParams.ids.length > 1){
            await Email
            .query()
            .whereNot('is_main', 1)
            .whereIn('id', allParams.ids )
            .delete()

            response.ok()
        }else if(allParams.ids.length == 1){
            const email = await Email.find(allParams.ids)
            if(email.is_main) return response.badRequest("Cannot delete the main email!")
            await email.delete();

            response.ok()
        }else return response.notFound()
    }
}

module.exports = EmailController
