'use strict'

const Route = use('Route');

module.exports = Route.group(() => {
    Route.post('register', 'AuthController.register')

    Route.post('login','AuthController.login')

    Route.get('me', 'AuthController.me').middleware(['getUser'])
})