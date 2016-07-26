"use strict";

module.exports = function(sequelize, Sequelize) {
  var Profile = sequelize.define('Profile', {
  	username: { type: Sequelize.STRING, allowNull: true, unique: true },
  	name: { type: Sequelize.STRING, allowNull: true },
    avatar: { type: Sequelize.STRING, allowNull: true },
    location: { type: Sequelize.STRING, allowNull: true },
    website: { type: Sequelize.STRING, allowNull: true },
    bio: { type: Sequelize.STRING, allowNull: true },
    pid: { type: Sequelize.INTEGER, allowNull: false, unique: true, references: { model:"Person", key: "id" }},
    social_facebook: { type: Sequelize.STRING, allowNull: true },
    social_instagram: { type: Sequelize.STRING, allowNull: true },
    social_twitter: { type: Sequelize.STRING, allowNull: true } 
  }, {
    underscored: true,
    paranoid: true,
  	freezeTableName: true,
    instanceMethods: {},
    classMethods: {
      // Associates profile to person through key pid
    	associate: function(models) {
	    	Profile.belongsTo(models.Person, { foreignKey: 'pid'});
	    },
      // Creates instance of profile class 
		createOne: function(pid,callback){ 
			Profile.create({
				pid: pid
			})
      // newperson is the newly created instance of profile class
			.then(function(newPerson) {
      // first argument to callback shows that there is no errors; second is 
      // return value
		  		callback(null,newPerson);
		  	})
      // error handling
		  	.catch(function(error) {
		    	callback(error);
  			});
		},
		updateOne: function(id,data,callback){ 
			Profile.findOne({where:{pid:id}})
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
  return Profile;
};
