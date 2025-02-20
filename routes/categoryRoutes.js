const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const authenticateToken = require('../middleware/authMiddleware');

router.post('/create', authenticateToken, categoryController.createCategory);



router.post('/createcategory',authenticateToken, categoryController.createCategory);


router.get('/getcategory',authenticateToken, categoryController.getAllCategories);


router.put('/updatecategory/:id',authenticateToken, categoryController.updateCategory);

router.delete('delete/:id', authenticateToken,categoryController.deleteCategory);

module.exports = router;
