const express = require('express')
const router = express.Router()
const { authCheck, adminCheck } = require('../middlewares/authCheck')
const {
    listUsers,
    changeStatus,
    changeRole,
    updateUserBodyInfo,
    getLatestUsers,
} = require('../controllers/user')

router.get('/users', authCheck, adminCheck, listUsers)
//  adminCheck,
router.post('/change-status', authCheck, adminCheck, changeStatus)
// authCheck, adminCheck,
router.post('/change-role', authCheck, adminCheck, changeRole)
// authCheck, adminCheck,

router.put('/user/update-body', authCheck, updateUserBodyInfo);

router.get('/users/latest', authCheck, adminCheck, getLatestUsers);

module.exports = router