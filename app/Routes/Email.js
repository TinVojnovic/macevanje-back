'use strict'

const Route = use('Route');

module.exports = Route.group(() => {
    Route.post('create', 'EmailController.create')

    Route.get('fetchAll','EmailController.fetchAll')

    Route.get('fetchSingle/:id','EmailController.fetchSingle')

    Route.put('/:id', 'EmailController.update')

    Route.delete('delete', 'EmailController.delete')

})