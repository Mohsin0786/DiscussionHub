const express = require('express');
const {
    createUser, loginUser, updateUser, deleteUser, listUsers, searchUser, followUser
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/register', createUser);
router.post('/login', loginUser);
router.put('/:id', protect, updateUser);
router.delete('/:id', protect, deleteUser);
router.get('/', protect, listUsers);
router.get('/search', protect, searchUser);
router.post('/follow/:id', protect, followUser);

module.exports = router;
