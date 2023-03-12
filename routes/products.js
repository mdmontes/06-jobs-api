const express = require('express')
const router = express.Router()
const { 
  getAllProducts, 
  createProduct, 
  getOneProduct, 
  editOneProduct, 
  deleteOneProduct
} = require('../controllers/products')

router.route('/').get(getAllProducts).post(createProduct);  
router.route('/:id').get(getOneProduct).patch(editOneProduct).delete(deleteOneProduct) 

module.exports = router