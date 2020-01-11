'use strict';

const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  class User extends Sequelize.Model {}
  User.init({
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    firstName: {type: Sequelize.STRING,
      validate: {
        notEmpty: {msg: 'First name is required'}
      }
    },
    lastName: {type: Sequelize.STRING,
        validate: {
            notEmpty: {msg:'Last name is required'}
        }
    },
    emailAddress: {type: Sequelize.STRING,
        validate:{
            notEmpty: {msg:'Email is required'}
        }},
    password: {type: Sequelize.STRING,
        validate: {
            notEmpty: {msg: 'Password is required'}
        }},

  }, { sequelize });

  //Define associations. User model has many association between User and Course models. 
  User.associate = (models) => {
      User.hasMany(models.Course, {foreignKey: 'userId'});
  };

  

  return User;
};
