'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ContactSchema extends Schema {
  up () {
    this.create('contacts', (table) => {
      table.increments()
      table.integer("user_id").unsigned().references("id").inTable("users").onDelete("CASCADE")
      table.integer("contact_id").unsigned().references("id").inTable("users").onDelete("CASCADE")
      table.timestamps()
    })
  }

  down () {
    this.drop('contacts')
  }
}

module.exports = ContactSchema
