import { start } from 'start.mjs'
jest.mock('llog')
jest.mock('errortrap', () => jest.fn())
jest.mock('servicebus-register-handlers')
jest.mock('servicebus-bus-common', () => ({
  makeBus: jest.fn(() => ({
    use: jest.fn(),
    send: jest.fn(),
    listen: jest.fn(),
    publish: jest.fn(),
    subscribe: jest.fn()
  }))
}))
jest.mock('../../../config.mjs')

describe('./bin/start.mjs', () => {
  it('should start our servicebus-agenda-service', () => {
    let errortrap = require('errortrap')

    start()
    expect(errortrap).toBeCalled()
  })
})
