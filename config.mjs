import cconfig from 'cconfig'

// Using cconfig, a "cascading config" library, env variables will be
// cascaded on top of the default configuration.

const defaultConfig = {
  PORT: 3000,
  secretPath: '/run/secrets/',
  servicebus: {
    prefetch: 10,
    queuePrefix: 'servicebus-agenda-service',
    redis: {
      host: process.env.REDIS_HOST || 'localhost',
      port: process.env.REDIS_PORT || '6379',
      password: process.env.REDIS_PASSWORD,
    },
    rabbitmq: {
      host: process.env.RABBITMQ_HOST || 'localhost',
      port: process.env.RABBITMQ_PORT || '5672',
      user: process.env.RABBITMQ_USER || 'guest',
      password: process.env.RABBITMQ_PASSWORD || 'guest'
    },
  },
  agenda:{
    mongo: {
      host: process.env.MONGODB_HOST || "localhost",
      port: process.env.MONGODB_PORT || "27017",
      database: process.env.MONGODB_DATABASE || "servicebus-agenda-service",
      username: process.env.MONGODB_USERNAME,
      password: process.env.MONGODB_PASSWORD
    },
    db: {
      collection: 'agendaJobs'
    }
  }
}

// add env variables on top of defaultConfig
let cascadedConfig = cconfig(defaultConfig)

export const getMongoUrl = ({ host, port, database, username, password } = {}) => {
  let auth = username && password ? `${username}:${password}@` : ''
  return `mongodb://${auth}${host}:${port}/${database}`
}
cascadedConfig.agenda.db.address = getMongoUrl(cascadedConfig.agenda.mongo)

// Everything that comes in from command line is a string,
// if you need a type, convert it here by the key name
const finalConfig = Object.keys(cascadedConfig).reduce((finalConfig, key) => {
  let value = cascadedConfig[key]

  switch (key) {
  case 'PORT':
    value = parseInt(value, 10)
    break

  default:
    break
  }

  finalConfig[key] = value
  return finalConfig
}, {})

export const config = finalConfig
