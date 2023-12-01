let { Sequelize, DataTypes, Model, QueryTypes, Op } = require("sequelize")
let config = require('config')
let mySQL = config.get('mysql')
let sequelizeCon = new Sequelize(mySQL)
sequelizeCon.authenticate().then(() => {
    console.log(`MySql Connected`)
}).catch((error) => {
    console.log("Unable to establish connection")
})

module.exports = {
    sequelizeCon,
    DataTypes,
    Model,
    QueryTypes,
    Op
}