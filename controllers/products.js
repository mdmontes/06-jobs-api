const { StatusCodes } = require('http-status-codes')
const { BadRequestError, NotFoundError} = require('../errors')
const {Product} = require('../models/Products')

const getAllProducts = async (req, res) =>{
  const products = await Product.find({ createdBy_ID: req.user.userId }).sort('createdAt')
  res.status(StatusCodes.OK).json({ products, count: products.length });
}

const createProduct = async (req, res) =>{
  req.body.createdBy_ID = req.user.userId
  req.body.user_name = req.user.name
  const product = await Product.create(req.body) 
  res.status(StatusCodes.CREATED).json({product, msg:`the product ${product.name} was created`});
}

const getOneProduct = async (req, res) =>{

  const {
    user: { userId },
    params: { id: productID },
  } = req
  
  const products = await Product.findOne({_id: productID, createdBy_ID: userId })

  if (!products || products === null) {
    throw new NotFoundError(`No product with id ${productID}`)}

  res.status(StatusCodes.OK).json(products);
}

const editOneProduct = async (req, res) =>{
  const {
    body:{name, price, manufacturer},
    user: { userId },
    params: { id: productID },
  } = req

  if (!name ||!price ||!manufacturer){
    throw new BadRequestError(`Bad Request Error. Check to make sure you properly modified the NAME, PRICE, and/or MANUFACTURER`)
  }

  const product = await Product.findByIdAndUpdate(
    {_id: productID, createdBy_ID: userId },
    req.body,
    { new: true, runValidators: true })
  
  if (!product) {
    throw new NotFoundError(`No product with id ${productID}`)}

  res.status(StatusCodes.OK).json({product, msg:`the product ${product.name} was updated`})
}

const deleteOneProduct = async (req, res) =>{
  const {
    user: { userId },
    params: { id: productID },
  } = req

  const products = await Product.findOneAndDelete({
    _id: productID, 
    createdBy_ID: userId })

  if (!products) {
    throw new NotFoundError(`No product with id ${productID}`)}

  res.status(StatusCodes.OK).json({msg: `The product ${products.name} with productid was deleted`});  
}

module.exports = {
  getAllProducts,
  createProduct,
  getOneProduct,
  editOneProduct,
  deleteOneProduct,
}