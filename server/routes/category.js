const express = require('express')
const router = express.Router()
const { create, list, remove } = require('../controllers/category')
const { authCheck, adminCheck } = require('../middlewares/authCheck')
// const { update } = require('../controllers/food')

// // @ENDPOINT http://localhost:5001/api/category
router.post('/category', authCheck, adminCheck, create)
// authCheck, adminCheck,
router.get('/category', list)
// router.put('/category/:id',update)  
router.delete('/category/:id', authCheck, adminCheck, remove)
// authCheck, adminCheck,


module.exports = router