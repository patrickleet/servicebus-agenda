import log from 'llog'
import Agenda from 'agenda'
import rid from 'readable-id-mjs'
import { getBus } from './bus.mjs'
import { config } from '../config.mjs'

const { db } = config.agenda

log.info('defining job "sendCommand"')

export const agenda = new Agenda({ db })

agenda.define('sendCommand', async (job, done) => {
  let { command, payload } = job.attrs.data
  let bus = await getBus()
  log.info(`sending command ${command}`)
  await bus.sendAsync(
    command,
    payload,
    { ack: true, correlationId: rid() }
  )
  done()
})
