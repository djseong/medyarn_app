module.exports = {
  // upgrade database
  // use queryinterface to modify database
  up: function(queryInterface, Sequelize) {
    // make new table
    queryInterface.createTable(
    'question',
    {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      title: { type: Sequelize.STRING, allowNull: true },
      text: {type: Sequelize.STRING, allowNull: true}, 
      created_person_id: { type: Sequelize.INTEGER, allowNull: true, references: { model:"person", key: "id" } },
      created_profile_id: {type: Sequelize.INTEGER, allowNull: true, references: {model: "profile", key: "pid"}},
      is_anonymous: { type: Sequelize.INTEGER, allowNull: false },
      upvoter_count: { type: Sequelize.INTEGER, allowNull: true },
      downvoter_count: { type: Sequelize.INTEGER, allowNull: true },
      is_answered: {type: Sequelize.INTEGER, allowNull: true}, 
      created_at: { type: Sequelize.DATE, allowNull: true },
      updated_at: { type: Sequelize.DATE, allowNull: true },
      deleted_at: { type: Sequelize.DATE, allowNull: true }
    },
    {
      engine: 'INNODB', // default: 'InnoDB'
      charset: 'utf8',
      collate: 'utf8_general_ci'
    }
  ) /*
    queryInterface.addColumn('question', 'created_profile_id', {type: Sequelize.INTEGER, allowNull: true, references: {model: "profile", key: "pid"}},
      {
      engine: 'INNODB', // default: 'InnoDB'
      charset: 'utf8',
      collate: 'utf8_general_ci'
    })*/
  },
  // downgrades database (reverse changes)
  down: function(queryInterface, Sequelize) {
    // delete profile table
    queryInterface.sequelize.query('IF EXISTS (SELECT * FROM person) ALTER TABLE question DROP FOREIGN KEY question_ibfk_1'); 
    queryInterface.dropTable('question');
  }
}
