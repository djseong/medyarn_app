 
module.exports = {
  // upgrade database
  // use queryinterface to modify database
  up: function(queryInterface, Sequelize) {
    // make new table
    queryInterface.createTable(
	  'profile',
	  {
	    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
	    username: { type: Sequelize.STRING, allowNull: true, unique: true },
	    name: { type: Sequelize.STRING, allowNull: true },
	    avatar: { type: Sequelize.STRING, allowNull: true },
	    location: { type: Sequelize.STRING, allowNull: true },
	    website: { type: Sequelize.STRING, allowNull: true },
	    bio: { type: Sequelize.STRING, allowNull: true },
	    social_facebook: { type: Sequelize.STRING, allowNull: true },
	    social_instagram: { type: Sequelize.STRING, allowNull: true },
	    social_twitter: { type: Sequelize.STRING, allowNull: true },
	    pid: { type: Sequelize.INTEGER, allowNull: false, unique: true, references: { model:"person", key: "id" }},
	    created_at: { type: Sequelize.DATE, allowNull: true },
	    updated_at: { type: Sequelize.DATE, allowNull: true },
	    deleted_at: { type: Sequelize.DATE, allowNull: true }
	  },
	  {
	    engine: 'INNODB', // default: 'InnoDB'
	    charset: 'utf8',
    	collate: 'utf8_general_ci'
	  }
	)
  },
  // downgrades database (reverse changes)
  down: function(queryInterface, Sequelize) {
    queryInterface.sequelize.query('IF EXISTS (SELECT * FROM person) ALTER TABLE profile DROP FOREIGN KEY profile_ibfk_1');

    // delete profile table
    queryInterface.dropTable('profile');
  }
}
