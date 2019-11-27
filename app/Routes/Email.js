'use strict'

const Route = use('Route');

module.exports = Route.group(() => {
    Route.post('create/:id', 'EmailController.create')

    Route.put('update/:id', 'EmailController.update')

    Route.delete('delete', 'EmailController.delete')

})