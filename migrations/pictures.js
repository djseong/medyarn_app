module.exports = {
  // upgrade database
  // use queryinterface to modify database
  up: function(queryInterface, Sequelize) {
    // make new table
    queryInterface.createTable(
    'pictures',
    {
      file_path: { type: Sequelize.STRING, primaryKey: true},
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
    queryInterface.sequelize.query('IF EXISTS (SELECT * FROM question) ALTER TABLE pictures DROP FOREIGN KEY pictures_ibfk_1');

    // delete profile table
    queryInterface.dropTable('pictures');
  }
}
