"use strict";

module.exports = function(sequelize, DataTypes) {
    var Seller = sequelize.define('Seller', {
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
        stock: {
            type: DataTypes.INTEGER,
            field: 'stock'
        },
        district: {
            type: DataTypes.STRING,
            field: 'district'
        },
        email: {
            type: DataTypes.STRING,
            field: 'email'
        },
    }, {
        timestamps: true,

        createdAt: 'created_at' ,
        updatedAt: 'updated_at' ,
        deletedAt: 'deleted_at' ,


        paranoid: true,

        freezeTableName: true, // Model tableName will be the same as the model name
    });

    return Seller;
};
