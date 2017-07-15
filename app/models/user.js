/**
 * Created by rishabhkhanna on 16/07/17.
 */
const sequelize = require('sequelize');
const db = new sequelize({
    host: 'localhost',
    username: 'rishabh',
    database: 'newsapp',
    password: 'beyblade',
    dialect: 'mysql'
})
let userSchema = db.define('user', {

        email: {
            type: sequelize.DataTypes.STRING,
            unique: true
        },
        password: sequelize.DataTypes.STRING,
        key: {
            type: sequelize.DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        id: sequelize.DataTypes.STRING,
        token: sequelize.DataTypes.STRING,
        name: sequelize.DataTypes.STRING,
        via: sequelize.DataTypes.STRING
});
userSchema.sync({force:true});
module.exports = userSchema;
