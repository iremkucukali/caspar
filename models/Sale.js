"use strict";

module.exports = function(sequelize, DataTypes) {
    var Sale = sequelize.define('Sale', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV1,
            primaryKey: true,
            field: 'id'
        },
        location: {
            type: DataTypes.STRING,
            field: 'location'
        },
        numberOfCopies: {
            type: DataTypes.INTEGER,
            field: 'number_of_copies'
        },
        price: {
            type: DataTypes.DOUBLE,
            field: 'price'
        },
        comment: {
            type: DataTypes.TEXT,
            field: 'comment'
        },
    }, {
        timestamps: true,

        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',

        paranoid: true,

        freezeTableName: true // Model tableName will be the same as the model name

    });
    Sale.associate = function (models) {
        Sale.belongsTo(models.Seller, {
            as: 'Seller',
            foreignKey: 'seller_id'
        })
    };

    return Sale;
};
