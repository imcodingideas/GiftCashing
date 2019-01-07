const mongoose = require('mongoose')

// import environmental variables
const config = require('./config')

// Connect to our Database and handle any bad connections
mongoose.connect(
  config.db.uri,
  { useNewUrlParser: true }
)
mongoose.Promise = global.Promise
mongoose.connection.on('error', err => {
  console.error(`${err.message}`)
})

// import all of our models
require('./models/user')
require('./models/gift')

// Start our app!
const app = require('./app')

app.set('port', config.port || process.env.PORT)
const server = app.listen(app.get('port'), () => {
  console.log(`GiftCashing is running → PORT ${server.address().port}`)
})
