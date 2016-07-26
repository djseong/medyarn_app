module.exports = {
  // upgrade database
  // use queryinterface to modify database
  up: function(queryInterface, Sequelize) {
    // make new table
    queryInterface.createTable(
    'downvoter',
    {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      person_id: { type: Sequelize.INTEGER, allowNull: false, references:{model: "person", key: "id"} },
      question_id: { type: Sequelize.INTEGER, allowNull: false, references: { model:"question", key: "id" } }
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
    queryInterface.sequelize.query('IF EXISTS (SELECT * FROM person) ALTER TABLE downvoter DROP FOREIGN KEY downvoter_ibfk_1');
    queryInterface.sequelize.query('IF EXISTS (SELECT * FROM question) ALTER TABLE downvoter DROP FOREIGN KEY downvoter_ibfk_2'); 

    // delete profile table

    queryInterface.dropTable('downvoter');
  }
}
