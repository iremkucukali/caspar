"use strict";

module.exports = function(sequelize, DataTypes) {
    var CashBox = sequelize.define('CashBox', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV1,
            primaryKey: true,
            field: 'id'
        },
        name: {
            type: DataTypes.STRING,
            field: 'name'
        },
        amount: {
            type: DataTypes.INTEGER,
            field: 'amount'
        }
    }, {
        timestamps: true,

        createdAt: 'created_at' ,
        updatedAt: 'updated_at' ,
        deletedAt: 'deleted_at' ,

        paranoid: true,

        freezeTableName: true, // Model tableName will be the same as the model name
    });

    return CashBox;
};
