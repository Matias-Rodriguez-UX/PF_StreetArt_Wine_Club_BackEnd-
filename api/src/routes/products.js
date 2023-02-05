const { Router } = require('express');
const { newProduct } = require('../controllers/newProduct')
const { productById } = require('../controllers/getProductById')
const { getProducts } = require('../controllers/getProducts')
const { deleteProduct } = require('../controllers/deleteProduct')
const { updateProduct } = require('../controllers/upDateProduct')
const { getProductsByValue } = require('../controllers/getProductsByValue')
const { getOrderProducts } = require('../controllers/getOrderProducts');
const { getReviews } = require('../controllers/getReviews');
const {newReview}  = require('../controllers/newReview');
const {deleteReview} = require ('../controllers/deleteReview');
const {updateReview} = require ('../controllers/updateReview');

const router= Router();

router.post('/', async (req, res)=>{
    const { name, price, image, volume, quantity, stock, details, winerys, grapes, state, regions, types} = req.body;
    try {
    let result = await newProduct( name, price, image, volume, quantity, stock, details, winerys, grapes, state, regions, types)
    res.status(200).send({result})
} catch (error) {
    res.status(400).send(error.message)
}
})

router.get('/', async (req, res) => {
    try {
        let { name } = req.query;
        const result = await getProducts(name);
        res.status(200).send(result)
    } catch (error) {
        res.status(400).send(error.message)
    }
});

router.get('/filters', async (req, res) => {
    try {
        let { filter, value } = req.body;
        // Table debe estar correctamente escrita y value siempre es la columna name
        const result = await getProductsByValue(filter, value);
        res.status(200).send(result)
    } catch (error) {
        res.status(400).send(error.message)
    }
});

router.get('/orders', async (req, res) => {
    try {
        let { order, value } = req.body;
   
        const result = await getOrderProducts(order, value);
        res.status(200).send(result)
    } catch (error) {
        res.status(400).send(error.message)
    }
});

router.get('/:idProduct', async (req, res) => {
    const productId = req.params.idProduct
    try {
        let result = await productById(productId);
        res.status(200).send(result)
    } catch (error) {
        res.status(400).send(error.message)
    }
});

router.put('/:id', async (req, res)=>{
    try {
        const id = req.params.id
        const { name, price, image, volume, quantity, stock, details, winerys, grapes, state, regions, types} = req.body;
    let result = await updateProduct(id, name, price, image, volume, quantity, stock, details, winerys, grapes, state, regions, types)
    res.status(200).send(result)
} catch (error) {
    res.status(400).send(error.message)
}
})

router.delete('/:id', async (req, res)=>{
    try {
        const id = req.params.id
    let result = await deleteProduct(id)
    res.status(200).send(result)
} catch (error) {
    res.status(400).send(error.message)
}
})  


router.get('/:id/review', async(req,res)=>{
    try{
        const {id} = req.params;
        let result = await getReviews(id)
        res.status(200).send(result)
    } catch(error){
        res.status(400).send(error.message)
    }
})

router.post('/:id/review', async(req,res)=>{
    try{
        const {id} = req.params;
        const {review, rating} = req.body;

        let result = await newReview(id, review, rating)
        res.status(200).send(result)
    } catch(error){
        res.status(400).send(error.message)
    }
})

router.delete('/:id/review/:idReview', async(req,res)=>{
    try{
        const {id, idReview} = req.params

        let result = await deleteReview(id, idReview)
        res.status(200).send(result)

    } catch(error){
        res.status(400).send(error.message)

    }
})

router.put('/:id/review/:idReview', async(req,res)=>{
    try{
        const {id, idReview} = req.params
        const { review,rating} = req.body;

        let result = await updateReview(id, idReview, review, rating)
        res.status(200).send(result)
    } catch(error){
        res.status(400).send(error.message)
    }
})





module.exports = router;