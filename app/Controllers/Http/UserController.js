'use strict'

const User = use("App/Models/User")
const { validate, sanitize } = use('Validator')

class UserController {
    async create({ request, response }) {
        const allParams = sanitize(request.post(), {
            email: 'normalize_email'
        })

        const validation = await validate(allParams, {
            name: 'required',
            surname: 'required',
            email: 'required|email|unique:users,email',
            phone: "string",
            type: "required",
            userIds: "array", //if the user type is "contact", request an array of user IDs to attach to
            'userIds.*': "integer"
        })

        if (validation.fails()) return response.badRequest(validation.messages())

        const user = await User.create({
            name: allParams.name,
            surname: allParams.surname,
            email: allParams.email,
            type: allParams.type
        })

        if (allParams.type === "contact") user.userContacts().attach(allParams.userIds)

        if (allParams.phone) {
            await user.phones().create({
                number: allParams.phone,
            })
        }

        await user.emails().create({
            mail: allParams.email,
            is_main: true
        })

        response.ok({ user })
    }

    async fetchSingle({ response, params }) {
        const user = await User
            .query()
            .where("users.id", params.id)
            .with("phones")
            .with("emails")
            .with("contacts")
            .fetch()
        if (!user) return response.notFound()
        response.ok({ user })
    }

    async fetchAll({ response }) {
        const users = await User
            .query()
            .with("phones")
            .with("emails")
            .with("contacts")
            .fetch()

        response.ok({ users })
    }

    async update({ request, response, params }) {
        const user = await User.findOrFail(params.id)

        const allParams = sanitize(request.post(), {
            email: "normalize_email"
        })

        const validation = await validate(allParams, {
            email: 'email|unique:users,email'
        })

        if (validation.fails()) return response.badRequest(validation.messages())

        user.merge({
            name: allParams.name,
            surname: allParams.surname,
            email: allParams.email,
            type: allParams.type,
        })

        await user.save()

        if (allParams.email) {
            const email = await user.emails().where('is_main', true).first()
            email.merge({
                mail: allParams.email
            })
            await email.save()
            response.ok({email})
        }

        response.ok({user})
    }

    async delete({request, response}){
        const allParams = request.post()
        const validation = await validate(allParams, {
            ids: 'required|array',
            'ids.*': 'integer'
        })

        if(validation.fails()) return response.badRequest(validation.messages())

        if(allParams.ids.length > 1){
            await User
            .query()
            .whereIn('id', allParams.ids)
            .delete()
        }else if(allParams.ids.length == 1){
            const user = await User.findOrFail(allParams.ids)
            await user.delete()
        }else{
            response.notFound()
        }
    }
}

module.exports = UserController
