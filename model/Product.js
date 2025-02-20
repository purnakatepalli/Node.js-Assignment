
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Category = require('../model/Category');

const Product = sequelize.define('Product', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.STRING },
    price: { type: DataTypes.FLOAT, allowNull: false },
    stock: { type: DataTypes.INTEGER, allowNull: false },
    categoryId: { type: DataTypes.UUID, allowNull: false, references: { model: Category, key: 'id' } },
    imageUrl: { type: DataTypes.STRING }
});

module.exports = Product;
