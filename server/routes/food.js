const express = require('express')
const router = express.Router()
const { 
    create,
    list,
    read,
    update,
    remove,
    // listby, 
    searchFilters, 
    createImages, 
    removeImage,
    getPopularFoods
} = require('../controllers/food')
const { authCheck, adminCheck } = require('../middlewares/authCheck')
// http://localhost:5001/api/food
router.post('/food', authCheck, adminCheck, create)
// authCheck, adminCheck,
router.get('/foods', list)
router.get('/food/:id',read)
router.put('/food/:id', authCheck, adminCheck, update) 
// authCheck, adminCheck,
router.delete('/food/:id', authCheck, adminCheck, remove) 
// authCheck, adminCheck,
// router.post('/foodby',listby)
router.post('/search/filters', searchFilters)

router.get("/foods/popular", getPopularFoods);

router.post('/images', authCheck, adminCheck, createImages)
// // authCheck, adminCheck,
router.post('/removeimages', authCheck, adminCheck, removeImage)
// // authCheck, adminCheck,



module.exports = router