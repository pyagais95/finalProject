const Sequelize = require('sequelize')
const BookModel = require('./models/book')
const UserModel = require('./models/user')
const config = require('../config.js')

const sequelize = new Sequelize('myBooks', config.user, config.dbPassword, {
  host: 'localhost',
  dialect: 'mysql',
  dialectOptions: {
    charset: 'utf8',
  },
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
})

const Book = BookModel(sequelize, Sequelize)
const User = UserModel(sequelize, Sequelize)

sequelize.sync({ force: false })
  .then(() => {
    console.log(`Database & tables created!`)
  })

module.exports = {
  Book,
  User
}