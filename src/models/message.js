'use strict';
let Sequelize = require('sequelize');

module.exports = function (sequelize, DataTypes) {
    let Message = sequelize.define('Message', {
        messageId: {
            type: Sequelize.BIGINT(11),
            autoIncrement: true,
            primaryKey: true
        },
        app: {
            type: Sequelize.STRING
        },
        message: {
            type: Sequelize.STRING(4096),
        },
        expire: {
            type: Sequelize.DATE
        },
    }, {
        classMethods: {},
        charset: 'utf8mb4',
        collate: 'utf8mb4_general_ci',
        indexes: [
            {
                fields: ['app']
            }
        ]
    });

    return Message;
};
