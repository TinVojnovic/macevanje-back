'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class EmailSchema extends Schema {
  up () {
    this.create('emails', (table) => {
      table.increments()
      table.string("mail").notNullable().unique()
      table.integer("user_id").unsigned().references("id").inTable("users").onDelete('CASCADE')
      table.boolean('is_main').defaultTo(false)
      table.timestamps()
    })
  }

  down () {
    this.drop('emails')
  }
}

module.exports = EmailSchema
