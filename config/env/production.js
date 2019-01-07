const config = {
  host: 'localhost',
  port: process.env.PORT,
  db: {
    uri: process.env.DATABASE,
    secret: 'anything',
  },
}

module.exports = config
