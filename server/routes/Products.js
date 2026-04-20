const express = require('express');
const { createProduct, fetchAllProducts, fetchProductById, updateProduct } = require('../controller/Product');
const { Product } = require('../model/Product');
const { productUpload } = require('../services/productUpload');
const { isAdmin, isAuth, optionalAuth } = require('../services/common');

const router = express.Router();
//  /products is already added in base path
router.get('/', optionalAuth, fetchAllProducts)
      .get('/:id', optionalAuth, fetchProductById)
      .post('/', isAuth(), isAdmin, productUpload, createProduct)
      .patch('/:id', isAuth(), isAdmin, productUpload, updateProduct)
      // .get('/update/test',async(req,res)=>{
      //       // For adding discountPrice to existing data : delete this code after use
      //      const products = await Product.find({});
      //      for(let product of products){
      //       product.discountPrice = Math.round(product.price*(1-product.discountPercentage/100))
      //       await product.save()
      //       console.log(product.title+ ' updated')
      //      }
      //      res.send('ok')
      // })

      

exports.router = router;
