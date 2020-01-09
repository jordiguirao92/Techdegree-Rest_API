'use strict';

const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  class Course extends Sequelize.Model {}
  Course.init({
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {type: Sequelize.INTEGER,
      validate: {
        notEmpty: {msg: 'userId is required'}
      }
    },
    title: {type: Sequelize.STRING,
        validate: {
            notEmpty: {msg:'Title is required'}
        }
    },
    description: {type: Sequelize.TEXT,
        validate:{
            notEmpty: {msg:'Description is required'}
        }},
    estimatedTime: {type: Sequelize.STRING,
        allowNull: true
    },
    materialsNeeded: {type: Sequelize.STRING,
        allowNull: true
    } 

  }, { sequelize });

  //Define associations: Course model define a belongs to association between Course and User models. 
  Course.associate = (models) => {
      Course.belongsTo(models.User, {foreignKey: 'userId'});
  };

  return Course;
};
