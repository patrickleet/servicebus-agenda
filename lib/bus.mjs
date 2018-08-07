import log from 'llog'
import servicebus from 'servicebus-bus-common'
import Bluebird from 'bluebird'
import { config } from '../config.mjs'

log.info(`connecting to servicebus on ${config.servicebus.rabbitmq.host}`)

const makebus = servicebus.makeBus(config.servicebus)

export const getBus = async function () {
  let bus = await makebus
  Bluebird.promisifyAll(bus)
  return bus
}
