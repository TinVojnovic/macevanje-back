'use strict'

const Route = use('Route');

module.exports = Route.group(() => {
    
    Route.post('/createMany', 'MembershipController.createManyPayments')

    Route.post('/create/:id', 'MembershipController.createPayment')

    Route.put('/process/:id', 'MembershipController.processPayment')

    Route.put('/processMany', 'MembershipController.processManyPayments')
})