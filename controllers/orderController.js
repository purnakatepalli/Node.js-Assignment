
const { Order } = require('../model/Order');
const { OrderItem } = require('../model/orderItem');

/**
 * @swagger
 * tags:
 *    name : order
 *    description: All the API routes related to order management
 */

/**
 * @swagger
 * /order/place:
 *   post:
 *     summary: Place a new order
 *     tags: [order]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     productId:
 *                       type: integer
 *                     quantity:
 *                       type: integer
 *     responses:
 *       201:
 *         description: Order placed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 order:
 *                   type: object
 *                 orderItems:
 *                   type: array
 *                   items:
 *                     type: object
 *       400:
 *         description: Invalid request
 *       404:
 *         description: Product not found
 *       500:
 *         description: Failed to place order
 */

/**
 * @swagger
 * /order/user/{userId}:
 *   get:
 *     summary: Get all orders for a specific user
 *     tags: [order]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: ID of the user to fetch orders
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of orders for the user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       404:
 *         description: Orders not found
 *       500:
 *         description: Failed to fetch orders
 */

/**
 * @swagger
 * /order/update/{id}:
 *   patch:
 *     summary: Update the status of an order
 *     tags: [order]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the order to update
 *         schema:
 *           type: integer
 *       - in: body
 *         name: status
 *         description: The new status of the order
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             status:
 *               type: string
 *     responses:
 *       200:
 *         description: Order status updated successfully
 *       400:
 *         description: Invalid request
 *       404:
 *         description: Order not found
 *       500:
 *         description: Failed to update order
 */

/**
 * @swagger
 * /order/delete/{id}:
 *   delete:
 *     summary: Delete a specific order
 *     tags: [order]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the order to delete
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Order deleted successfully
 *       400:
 *         description: Invalid request
 *       404:
 *         description: Order not found
 *       500:
 *         description: Failed to delete order
 */

exports.placeOrder = async (req, res) => {
    try {
        const { userId, items } = req.body;
        console.log("req.body", req.body)
        let totalAmount = 0;

        const order = await Order.create({ userId, totalAmount });

        const orderItems = await Promise.all(
            items.map(async (item) => {
                const product = await Product.findByPk(item.productId);
                if (!product) return res.status(404).json({ error: 'Product not found' });

                totalAmount += product.price * item.quantity;
                return OrderItem.create({ orderId: order.id, productId: item.productId, quantity: item.quantity, price: product.price });
            })
        );

        await order.update({ totalAmount });

        res.status(201).json({ message: 'Order placed successfully', order, orderItems });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to place order' });
    }
};

exports.getOrdersByUser = async (req, res) => {
    try {
        const orders = await Order.findAll({
            where: { userId: req.params.userId },
            include: OrderItem
        });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
};

exports.updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const updated = await Order.update({ status }, { where: { id: req.params.id } });

        if (!updated[0]) return res.status(404).json({ error: 'Order not found' });
        res.json({ message: 'Order status updated' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update order' });
    }
};

exports.deleteOrder = async (req, res) => {
    try {
        const deleted = await Order.destroy({ where: { id: req.params.id } });
        if (!deleted) return res.status(404).json({ error: 'Order not found' });
        res.json({ message: 'Order deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete order' });
    }
};
