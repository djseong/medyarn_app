"use strict";

module.exports = function(sequelize, Sequelize) {
  var Topic = sequelize.define('Topic', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: Sequelize.STRING, allowNull: true },
      question_id: { type: Sequelize.INTEGER, allowNull: false, references: { model:"question", key: "id" } },
      created_at: { type: Sequelize.DATE, allowNull: true },
      updated_at: { type: Sequelize.DATE, allowNull: true },
      deleted_at: { type: Sequelize.DATE, allowNull: true }

  }, {
    // no spacing, use '_'
    underscored: true,
    // disable modification of table name
    freezeTableName: true,
    paranoid: true,
    timestamps: true,
    instanceMethods: {},
    classMethods: {
      // Associates profile to person through key pid
      associate: function(models) {
        Topic.belongsTo(models.Question, { foreignKey: 'question_id'});          
      },
      // Creates instance of profile class 
    createOne: function(data,callback){ 
      Topic.create({
        name: data.name,
        question_id: data.question_id
      })
      // newperson is the newly created instance of profile class
      .then(function(newTopic) {
      // first argument to callback shows that there is no errors; second is 
      // return value
          callback(null,newTopic);
        })
      // error handling
        .catch(function(error) {
          callback(error);
        });
    },
    restoreOne: function(id,callback){ 
      Topic.findOne({where:{question_id:id}, paranoid: false})
      // p is first entry of profile table with pid: id
      // returns instance, not object
        .then(function (p) { 
          p.restore()
            .then(function(up) {
              callback(null,up);
            })
            .catch(function(error) {
                callback(error);
              });
        }).catch(function(error) {
            callback(error);
          });
    },
    removeOne: function(id, callback){ 
      Topic.findOne({where:{question_id:id}}).then(function (p) {
        if (p) {
        p.destroy()
        .then(function(pd) {
          callback(null,pd);
        })       
        .catch(function(error) {
          callback(error);
        });
      }
      else {
        callback(null)
      }
      }); 
    }
    },
  });
  return Topic;
};
