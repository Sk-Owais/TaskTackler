let { sequelizeCon, Model, DataTypes } = require('../init/dbConfig')
class Permission extends Model { }
Permission.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, { tableName: 'permission', modelName: 'Permission', sequelize: sequelizeCon })

module.exports = { Permission }