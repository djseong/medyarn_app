exports.deleteAll = function () {
    return sequelize.drop({logging: false, cascade: true}).then(function() {
        return sequelize.sync({logging: false});
    });
};