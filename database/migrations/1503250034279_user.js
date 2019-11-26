'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UserSchema extends Schema {
  up () {
    this.create('users', (table) => {
      table.increments()
      table.string("name").notNullable()
      table.string("surname").notNullable()
      table.string("email").notNullable()
      table.string("password")
      table.enum("type",['member', 'admin', 'contact']).notNullable().defaultTo("member")
      table.timestamps()
    })
  }

  down () {
    this.drop('users')
  }
}

module.exports = UserSchema
