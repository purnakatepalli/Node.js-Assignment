const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const authenticateToken = require('../middleware/authMiddleware'); 


router.post('/placeOrder',authenticateToken, orderController.placeOrder);

router.get('/user/:userId',authenticateToken, orderController.getOrdersByUser);


router.put('/update/:id',authenticateToken, orderController.updateOrderStatus);


router.delete('/delete/:id',authenticateToken, orderController.deleteOrder);

module.exports = router;
