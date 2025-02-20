const { Product } = require('../model/product');
const cloudinary = require('../config/cloudinary');
const { Op } = require('sequelize');
/**
 * @swagger
 * tags:
 *    name: product
 *    description: All the API routes related to products
 */

/**
 * @swagger
 * /product:
 *   get:
 *     summary: Get all products
 *     tags: [product]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of all products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       400:
 *         description: Incorrect request
 *       401:
 *         description: Unauthorized access
 */

/**
 * @swagger
 * /product/create:
 *   post:
 *     summary: Create a new product
 *     tags: [product]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               body:
 *                 type: string
 *               author:
 *                 type: string
 *               category:
 *                 type: string
 *               price:
 *                 type: number
 *                 format: float
 *               image:
 *                 type: string
 *                 description: Optional image for the product
 *     responses:
 *       201:
 *         description: New product created successfully
 *       400:
 *         description: Error occurred
 *       401:
 *         description: Unauthorized access
 */

/**
 * @swagger
 * /product/{id}:
 *   get:
 *     summary: Get a specific product by ID
 *     tags: [product]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the product to fetch
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: The product details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       404:
 *         description: Product not found
 *       401:
 *         description: Unauthorized access
 */

/**
 * @swagger
 * /product/update/{id}:
 *   patch:
 *     summary: Update a specific product by ID
 *     tags: [product]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the product to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               body:
 *                 type: string
 *               author:
 *                 type: string
 *               category:
 *                 type: string
 *               price:
 *                 type: number
 *                 format: float
 *               image:
 *                 type: string
 *                 description: Optional image for the product
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       400:
 *         description: Error occurred
 *       404:
 *         description: Product not found
 *       401:
 *         description: Unauthorized access
 */

/**
 * @swagger
 * /product/{id}:
 *   delete:
 *     summary: Delete a specific product by ID
 *     tags: [product]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the product to delete
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       404:
 *         description: Product not found
 *       401:
 *         description: Unauthorized access
 */

/**
 * @swagger
 * /product/filter:
 *   get:
 *     summary: Get filtered products based on category, minPrice, and maxPrice
 *     tags: [product]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: The category ID to filter products by
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *           format: float
 *         description: Minimum price for filtering products
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *           format: float
 *         description: Maximum price for filtering products
 *     responses:
 *       200:
 *         description: A list of filtered products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       400:
 *         description: Incorrect request
 *       401:
 *         description: Unauthorized access
 */

exports.createProduct = async (req, res) => {
    try {
        let imageUrl = null;
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path);
            imageUrl = result.secure_url;
        }

        const product = await Product.create({ ...req.body, imageUrl });
        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ error: 'Product creation failed' });
    }
};

exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.findAll();
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch products' });
    }
};

exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (!product) return res.status(404).json({ error: 'Product not found' });
        res.json(product);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch product' });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const updated = await Product.update(req.body, { where: { id: req.params.id } });
        if (!updated[0]) return res.status(404).json({ error: 'Product not found' });
        res.json({ message: 'Product updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Product update failed' });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const deleted = await Product.destroy({ where: { id: req.params.id } });
        if (!deleted) return res.status(404).json({ error: 'Product not found' });
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Product deletion failed' });
    }
};

exports.getFilteredProducts = async (req, res) => {
    try {
        const { category, minPrice, maxPrice } = req.query;
        const where = {};

        if (category) where.categoryId = category;
        if (minPrice) where.price = { [Op.gte]: minPrice };
        if (maxPrice) where.price = { [Op.lte]: maxPrice };

        const products = await Product.findAll({ where });
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: 'Failed to filter products' });
    }
};
