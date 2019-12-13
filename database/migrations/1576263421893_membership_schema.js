'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class MembershipSchema extends Schema {
  up () {
    this.create('memberships', (table) => {
      table.increments()
      table.integer("user_id").unsigned().references("id").inTable("users").onDelete('CASCADE')
      table.bool("paid").notNullable().defaultTo(false)
      table.integer("month").notNullable()
      table.integer("year").notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('memberships')
  }
}

module.exports = MembershipSchema
