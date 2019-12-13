'use strict'

const Task = use('Task')

class CreatePayment extends Task {
  static get schedule () {
    return '0 */1 * * * *'
  }

  async handle () {
    this.info('Task CreatePayment handle')
  }
}

module.exports = CreatePayment
