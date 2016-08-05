"use strict";

module.exports = function(sequelize, Sequelize) {
  var Question = sequelize.define('Question', {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: Sequelize.STRING, allowNull: true },
    text: {type: Sequelize.STRING, allowNull: true}, 
    created_person_id: { type: Sequelize.INTEGER, allowNull: true, references: { model:"person", key: "id" } },
    created_profile_id: {type: Sequelize.INTEGER, allowNull: true, references: {model: "profile", key: "pid"} },
    is_anonymous: { type: Sequelize.INTEGER, allowNull: false },
    upvoter_count: { type: Sequelize.INTEGER, allowNull: true },
    downvoter_count: { type: Sequelize.INTEGER, allowNull: true },
    is_answered: {type: Sequelize.INTEGER, allowNull: true}, 
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
        // use belongsto when foreign key is on question
        Question.belongsTo(models.Person, { foreignKey: 'created_person_id'});
        Question.belongsTo(models.Profile, { foreignKey: 'created_profile_id'});
        // use hasmany when one question entry is related to multiple
        // entries in one other database
        Question.hasMany(models.Pictures, {foreignKey: 'question_id'});
        Question.hasMany(models.Answers, {foreignKey: 'question_id'});       
        // use hasone when foreign key is on other model like topic
        Question.hasOne(models.Topic, {foreignKey: 'question_id'}); 
      },
      // Creates instance of profile class 
    createOne: function(data,callback){ 
      Question.create({
        title: data.title,
        text: data.text,
        created_person_id: data.created_person_id,
        created_profile_id: data.created_person_id,
        is_anonymous: data.is_anonymous,
        upvoter_count: data.upvoter_count,
        downvoter_count: data.downvoter_count,
        is_answered: data.is_answered
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
    restoreOne: function(id,callback){ 
      Question.findOne({where:{id:id}, paranoid: false})
      // p is first entry of profile table with pid: id
      // returns instance, not object
        .then(function (p) { 
          if (!p){
            callback("no question selected"); 
          }
          else {
          p.restore()
            .then(function(up) {
              callback(null,up);
            })
            .catch(function(error) {
                callback(error);
              });
          }
        }).catch(function(error) {
            callback(error);
          });
    },
    removeOne: function(id, callback){ 
      Question.findOne({where: {id:id}}).then(function (p) {
        p.destroy()
        .then(function(pd) {
          callback(null,pd);
        })
        .catch(function(error) {
          callback(error);
        });
      }); 
    },
    },
  });
  return Question;
};
