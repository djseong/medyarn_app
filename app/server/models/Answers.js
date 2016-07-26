"use strict";

module.exports = function(sequelize, Sequelize) {
  var Answers = sequelize.define('Answers', {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      person_id: { type: Sequelize.INTEGER, allowNull: false, references:{model: "person", key: "id"} },
      question_id: { type: Sequelize.INTEGER, allowNull: true, references: { model:"question", key: "id" } },
      answer_id: {type: Sequelize.INTEGER, allowNull: true, references: {model: "answers", key: "id"}},
      text: {type: Sequelize.STRING, allowNull: true}, 
      created_at: { type: Sequelize.DATE, allowNull: true },
      updated_at: { type: Sequelize.DATE, allowNull: true },
      deleted_at: { type: Sequelize.DATE, allowNull: true }
  }, {
    // no spacing, use '_'
    underscored: true,
     // don't delete database entries but set the newly added attribute deletedAt
    // to the current date (when deletion was done). paranoid will only work if
    // timestamps are enabled
    paranoid: true,
    // disable modification of table name
    freezeTableName: true,
    instanceMethods: {},
    classMethods: {
      // Associates profile to person through key pid
      associate: function(models) {
        // use belongsto when foreign key is on this table
        Answers.belongsTo(models.Person, {foreignKey: 'person_id'})
        Answers.belongsTo(models.Question, {foreignKey: 'question_id'})
        Answers.hasOne(models.Answers, {foreignKey: 'answer_id'})     
      },
      // Creates instance of profile class 
    createOne: function(data,callback){ 
      Answers.create({
        person_id: data.person_id,
        question_id: data.question_id,
        answer_id: data.answer_id,
        text: data.text
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
      Answers.findOne({where:{id:id}})
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
  return Answers;
};
