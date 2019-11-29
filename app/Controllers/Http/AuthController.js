'use strict'

const User = use('App/Models/User')
const Database = use('Database')
const Hash = use('Hash')
const { validate, sanitize  } = use('Validator')

class AuthController {

    async register({ request, response }) {
        const allParams = sanitize(request.post(), {
            email: 'normalize_email'
        })
        const validation = await validate(allParams, {
            name: 'required',
            surname: 'required',
            email: 'required|email|unique:users,email',
            phone: "string",
            password:'string|required'
        })
        if(validation.fails()) return response.badRequest(validation.messages())

        const user = await User.create({
            name: allParams.name,
            surname: allParams.surname,
            email: allParams.email,
            password: allParams.password,
            type: "admin"
        })

        if (allParams.phone) {
            await user.phones().create({
                number: allParams.phone,
            })
        }

        await user.emails().create({
            mail: allParams.email,
            is_main: true
        })

        return user;
    }
    
    async login({request, response, auth, transform}) {
        const allParams = sanitize(request.post(), {
            email: 'normalize_email'
        })
        const validation = await validate(allParams, {
            email: 'required|email',
            password:'string|required',
        })
        if(validation.fails()) return response.badRequest(validation.messages())
        const user = await User.findBy('email', allParams.email)

        if (!user) return response.badRequest('auth.invalidPasswordOrEmail')

        // check pass
        const validPass = await Hash.verify(allParams.password, user.password)

        if (!validPass) return response.badRequest('auth.invalidPasswordOrEmail')

        // generate tokens
        const token = await this._generateUserTokens(auth, user)  // you can add token payload if needed as third parameter

        response.ok({
            user,
            token: token.token,
            refreshToken: token.refreshToken
        })
    }

    async _generateUserTokens(auth, user, customPayload) {
        return await auth
            .withRefreshToken()
            .generate(user, customPayload)
    }
    
    async me({user, response}){
        response.ok(user)
    }
}

module.exports = AuthController