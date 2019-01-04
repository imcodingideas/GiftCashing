const config = {
  host: 'localhost',
  port: process.env.IP,
  db: {
    uri: process.env.DATABASE,
    secret: 'anything',
  },
}

module.exports = config
