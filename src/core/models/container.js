'use strict';

module.exports = function(sequelize, DataTypes) {

    var Container = sequelize.define('Container', {
        id: {
            type: DataTypes.STRING(128),
            primaryKey: true
        },
        name: DataTypes.STRING(128),
        volumes: DataTypes.STRING(256),
        ports: DataTypes.STRING(256),
        public: DataTypes.INTEGER(8),
        image: DataTypes.STRING(128),
        status: DataTypes.STRING(128),
        type: DataTypes.STRING(128),
        server: DataTypes.STRING(128),
        metadata: DataTypes.TEXT,
        configuration: DataTypes.TEXT
    }, {
        tableName: 'containers',

        updatedAt: 'last_update',
        createdAt: 'date_of_creation'
    });

    return Container;
};
