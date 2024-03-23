const express = require('express');
const multer = require('multer');
const router = express.Router();
const isAuthenticated = require('../../middleware/auth/isAuthenticated');
const { editProfile } = require('../../controller/UserController');

const storage = multer.diskStorage({
    destination : (req, file, cb) => {
        cb(null, './uploads/images/profile_pictures/')
    },
    filename : (req, file, cb) => {
        const randomizeName = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + randomizeName);
    }
});

const upload = multer({storage}); 
router.use(isAuthenticated);

router.put('/profile/edit', upload.single('profile_picture'), editProfile);

module.exports = router;