
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const { Order } = require('../model/Order');


const OrderItem = sequelize.define('OrderItem', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    orderId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: Order, key: 'id' }
    },
   
    quantity: { type: DataTypes.INTEGER, allowNull: false },
    price: { type: DataTypes.FLOAT, allowNull: false }
});


module.exports = OrderItem;
