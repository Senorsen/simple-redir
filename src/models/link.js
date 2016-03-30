'use strict';
let Sequelize = require('sequelize');

module.exports = function (sequelize, DataTypes) {
    let Link = sequelize.define('Link', {
        linkId: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true
        },
        linkToken: {
            type: Sequelize.STRING,
            unique: true
        },
        linkUrl: {
            type: Sequelize.STRING(4096)
        }
    }, {
        classMethods: {},
        charset: 'utf8',
        collate: 'utf8_general_ci'
    });

    return Link;
};