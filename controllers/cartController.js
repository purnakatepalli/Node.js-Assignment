
const { Cart } = require('../model/Cart');
/**
 * @swagger
 * tags:
 *    name : cart
 *    description: All the API routes related to cart operations
 */

/**
 * @swagger
 * /cart/add:
 *   post:
 *     summary: Add an item to the cart
 *     tags: [cart]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *               productId:
 *                 type: integer
 *               quantity:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Item added to cart successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 userId:
 *                   type: integer
 *                 productId:
 *                   type: integer
 *                 quantity:
 *                   type: integer
 *       400:
 *         description: Bad request
 *       500:
 *         description: Failed to add item to cart
 */

/**
 * @swagger
 * /cart/{userId}:
 *   get:
 *     summary: View all items in the cart for a specific user
 *     tags: [cart]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: The user ID whose cart items are to be retrieved
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of items in the cart
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   userId:
 *                     type: integer
 *                   productId:
 *                     type: integer
 *                   quantity:
 *                     type: integer
 *       404:
 *         description: Cart is empty
 *       500:
 *         description: Failed to retrieve cart items
 */

/**
 * @swagger
 * /cart/remove/{id}:
 *   delete:
 *     summary: Remove an item from the cart
 *     tags: [cart]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the cart item to remove
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Item removed from cart successfully
 *       404:
 *         description: Item not found in cart
 *       500:
 *         description: Failed to remove item from cart
 */




exports.addToCart = async (req, res) => {
    try {
        const { userId, productId, quantity } = req.body;

    
        if (!userId || !productId || !quantity) {
            return res.status(400).json({ error: 'User ID, Product ID, and Quantity are required' });
        }

        // Create the cart item
        const cartItem = await Cart.create({ userId, productId, quantity });

        res.status(201).json(cartItem);
    } catch (error) {
        res.status(500).json({ error: 'Failed to add to cart' });
    }
};


exports.viewCart = async (req, res) => {
    const { userId } = req.params;

    try {
        const cartItems = await Cart.findAll({ where: { userId } });
        if (cartItems.length === 0) {
            return res.status(404).json({ error: 'Cart is empty' });
        }

        res.json(cartItems);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve cart items' });
    }
};


exports.removeFromCart = async (req, res) => {
    const { id } = req.params;

    try {
        const cartItem = await Cart.findByPk(id);
        if (!cartItem) {
            return res.status(404).json({ error: 'Item not found in cart' });
        }

        // Delete the cart item
        await cartItem.destroy();
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Failed to remove item from cart' });
    }
};

