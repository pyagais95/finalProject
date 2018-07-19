module.exports = (sequelize, type) => {
    return sequelize.define('user', {
        id: {
          type: type.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        email: {
          type: type.STRING,
          allowNull: false,
          defaultValue: false
        },
        password: type.STRING,
        name: type.STRING,
        phone: type.STRING
    })
}