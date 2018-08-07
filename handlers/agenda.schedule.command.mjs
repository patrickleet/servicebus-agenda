import log from 'llog'
import { agenda } from '../lib/agenda.mjs'

export const command = 'agenda.command.schedule'

export const where = ({data}) => data.command &&
                                  data.payload &&
                                  data.scheduleMethod &&
                                  data.scheduleTime

log.info({msg: `registering ${command}`, command})

export const listen = async function ({ type, datetime, data, cid }, done) {
  let job = agenda.create('sendCommand', {
    command: data.command,
    payload: data.payload
  })
  await job[data.scheduleMethod](data.scheduleTime, {
    skipImmediate: data.skipImmediate || false
  }).save()

  done()
}
