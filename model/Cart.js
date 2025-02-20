
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('../model/user');


const Cart = sequelize.define('Cart', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    userId: { type: DataTypes.UUID, allowNull: false, references: { model: User, key: 'id' } },
    productId: { type: DataTypes.UUID, allowNull: false },
    quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
    priceAtTime: { type: DataTypes.FLOAT, allowNull: false }  // Persistent pricing
});

module.exports = Cart;
