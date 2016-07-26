"use strict";

module.exports = function(sequelize, Sequelize) {
  var Pictures = sequelize.define('Pictures', {
      file_path: { type: Sequelize.STRING, primaryKey: true},
      question_id: { type: Sequelize.INTEGER, allowNull: false, references: { model:"question", key: "id" } }
  }, {
    // no spacing, use '_'
    underscored: true,
    // disable modification of table name
    freezeTableName: true,
    timestamps: false,
    instanceMethods: {},
    classMethods: {
      // Associates profile to person through key pid
      associate: function(models) {
        Pictures.belongsTo(models.Question, { foreignKey: 'question_id'});          
      },
      // Creates instance of profile class 
    createOne: function(data,callback){ 
      Pictures.create({
        file_path: data.file_path,
        question_id: data.question_id
      })
      // newperson is the newly created instance of profile class
      .then(function(newQuestion) {
      // first argument to callback shows that there is no errors; second is 
      // return value
          callback(null,newQuestion);
        })
      // error handling
        .catch(function(error) {
          callback(error);
        });
    },
    updateOne: function(id,data,callback){ 
      Pictures.findOne({where:{file_path:id}})
      // p is first entry of profile table with pid: id
      // returns instance, not object
        .then(function (p) { 
          p.updateAttributes(data)
            .then(function(up) {
              callback(null,up);
            })
            .catch(function(error) {
                callback(error);
              });
        }).catch(function(error) {
            callback(error);
          });
    }
    },
  });
  return Pictures;
};
