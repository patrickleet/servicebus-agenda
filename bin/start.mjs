#!/bin/sh
':' //# https://cloudnative.institute ; exec /usr/bin/env node --experimental-modules "$0" "$1"

import path from 'path'

import log from 'llog'
import errortrap from 'errortrap'
import registerHandlers from 'servicebus-register-handlers'
import { getBus } from '../lib/bus.mjs'
import { agenda } from '../lib/agenda.mjs'
import { config } from '../config.mjs'

// errortrap logs uncaught exceptions with llog before
// throwing an error
errortrap()

export const start = async (onStart) => {
  let bus = await getBus()

  log.info('starting agenda...')
  await agenda.start()

  log.info('registering handlers')
  const { queuePrefix } = config.servicebus
  await registerHandlers({
    bus,
    path: path.resolve(process.cwd(), 'handlers'),
    modules: true,
    queuePrefix
  })
  log.info('registered handlers')

  log.info('server is running')
}

start()

// Check out my blog for more resources!
// https://medium.com/@patrickleet
//
// Related Articles:
// https://hackernoon.com/what-makes-a-microservice-architecture-14c05ad24554
// https://codeburst.io/serverless-ish-a-scaling-story-5732945b93ab
//
