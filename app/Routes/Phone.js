'use strict'

const Route = use('Route');

module.exports = Route.group(() => {
    Route.post('create/:id', 'PhoneController.create')

    Route.put('update/:id', 'PhoneController.update')

    Route.delete('delete', 'PhoneController.delete')

})