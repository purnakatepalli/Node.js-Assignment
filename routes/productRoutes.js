const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const upload = require('../middleware/multer'); 
const authenticateToken = require('../middleware/authMiddleware'); 

router.post('/createProduct', upload.single('image'), productController.createProduct);
router.get('/getAllProducts', authenticateToken,productController.getAllProducts);
router.get('/getProductById/:id',authenticateToken, productController.getProductById);
router.put('/updateProduct/:id',authenticateToken, productController.updateProduct);
router.delete('/deleteProduct/:id',authenticateToken, productController.deleteProduct);
router.get('/getFilteredProducts', authenticateToken,productController.getFilteredProducts);

module.exports = router;
