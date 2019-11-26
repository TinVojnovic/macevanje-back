'use strict'

const Route = use('Route');

module.exports = Route.group(() => {
    Route.post('create', 'UserController.create')

    Route.get('fetch','UserController.fetchAll')

    Route.get('fetch/:id','UserController.fetchSingle')

    Route.put('update/:id', 'UserController.update')

    Route.delete('delete', 'UserController.delete')

})