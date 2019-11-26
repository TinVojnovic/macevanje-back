'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class PhoneSchema extends Schema {
  up () {
    this.create('phones', (table) => {
      table.increments()
      table.integer("number").notNullable()
      table.integer("user_id").unsigned().references("id").inTable("users").onDelete('CASCADE')
      table.timestamps()
    })
  }

  down () {
    this.drop('phones')
  }
}

module.exports = PhoneSchema
