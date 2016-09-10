module.exports = {
  // upgrade database
  // use queryinterface to modify database
  up: function(queryInterface, Sequelize) {
    // make new table
    /*queryInterface.createTable(
    'answers',
    {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      person_id: { type: Sequelize.INTEGER, allowNull: false, references:{model: "person", key: "id"} },
      question_id: { type: Sequelize.INTEGER, allowNull: true, references: { model:"question", key: "id" } },
      text: {type: Sequelize.STRING, allowNull: true}, 
      created_at: { type: Sequelize.DATE, allowNull: true },
      updated_at: { type: Sequelize.DATE, allowNull: true },
      deleted_at: { type: Sequelize.DATE, allowNull: true },
      answer_id: { type: Sequelize.INTEGER, allowNull: true, references: {model: "answers", key: "id"}}

    },
    {
      engine: 'INNODB', // default: 'InnoDB'
      charset: 'utf8',
      collate: 'utf8_general_ci'
    }
  )*/ 
  queryInterface.addColumn('answers', 'answer_id', {type: Sequelize.INTEGER, allowNull: true, references: {model: "answers", key: "id"}},
      {
      engine: 'INNODB', // default: 'InnoDB'
      charset: 'utf8',
      collate: 'utf8_general_ci'
    })
  },
  // downgrades database (reverse changes)
  down: function(queryInterface, Sequelize) {
    // delete profile table
    queryInterface.dropTable('answers');
  }
}
