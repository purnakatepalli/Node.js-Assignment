
const { Category } = require('../model/Category');

/**
 * @swagger
 * tags:
 *    name : category
 *    description: All the API routes related to category operations
 */

/**
 * @swagger
 * /category/create:
 *   post:
 *     summary: Create a new category
 *     tags: [category]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the category (required)
 *               description:
 *                 type: string
 *                 description: A description of the category (optional)
 *     responses:
 *       201:
 *         description: Category created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 description:
 *                   type: string
 *       400:
 *         description: Bad request (e.g., missing required fields)
 *       500:
 *         description: Category creation failed
 */

/**
 * @swagger
 * /category:
 *   get:
 *     summary: Get all categories
 *     tags: [category]
 *     responses:
 *       200:
 *         description: List of all categories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   description:
 *                     type: string
 *       500:
 *         description: Failed to fetch categories
 */

/**
 * @swagger
 * /category/{id}:
 *   put:
 *     summary: Update a category
 *     tags: [category]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The category ID to update
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the category (required)
 *               description:
 *                 type: string
 *                 description: A description of the category (optional)
 *     responses:
 *       200:
 *         description: Category updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 description:
 *                   type: string
 *       400:
 *         description: Bad request (e.g., missing required fields)
 *       404:
 *         description: Category not found
 *       500:
 *         description: Category update failed
 */

/**
 * @swagger
 * /category/{id}:
 *   delete:
 *     summary: Delete a category
 *     tags: [category]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The category ID to delete
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Category deleted successfully
 *       404:
 *         description: Category not found
 *       500:
 *         description: Category deletion failed
 */




// Create a new category
exports.createCategory = async (req, res) => {
    try {
        const { name, description } = req.body;

        // Ensure that name is provided
        if (!name) {
            return res.status(400).json({ error: 'Category name is required' });
        }

        // Create the category
        const category = await Category.create({ name, description });

        res.status(201).json(category);
    } catch (error) {
        res.status(500).json({ error: 'Category creation failed' });
    }
};

// Get all categories
exports.getAllCategories = async (req, res) => {
    try {
        const categories = await Category.findAll();
        res.json(categories);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch categories' });
    }
};

// Update an existing category
exports.updateCategory = async (req, res) => {
    const { id } = req.params;
    const { name, description } = req.body;

    try {
        // Check if category exists
        const category = await Category.findByPk(id);
        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }

        // Update the category
        category.name = name || category.name;
        category.description = description || category.description;
        await category.save();

        res.json(category);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update category' });
    }
};

// Delete a category
exports.deleteCategory = async (req, res) => {
    const { id } = req.params;

    try {
        const category = await Category.findByPk(id);
        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }

        // Delete the category
        await category.destroy();
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete category' });
    }
};

