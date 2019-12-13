'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

_requireRoutes('User').prefix('api/user')
_requireRoutes('Email').prefix('api/email')
_requireRoutes('Phone').prefix('api/phone')
_requireRoutes('Auth').prefix('api/auth')
_requireRoutes('Membership').prefix('api/membership')

function _requireRoutes(group) {
  return require(`../app/Routes/${group}`)
}
