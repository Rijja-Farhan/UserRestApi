const express = require('express');
const {createUser,getUsers,updateUser,deleteUser,getUserById} = require('../controllers/userController');

const router = express.Router();

router.post('/create', createUser);
router.get('/get', getUsers); 
router.put('/update/:id', updateUser); 
router.delete('/delete/:id', deleteUser); 
router.get('/get/:id', getUserById); 

module.exports = router;
