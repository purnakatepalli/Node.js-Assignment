const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const authenticateToken = require('../middleware/authMiddleware'); 


router.post('/cardadd',authenticateToken, cartController.addToCart);

router.get('/getcarddetails/:userId',authenticateToken, cartController.viewCart);

router.delete('/removecard/:id', authenticateToken,cartController.removeFromCart);

module.exports = router;
