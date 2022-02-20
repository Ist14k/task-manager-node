const express = require('express');
const multer = require('multer');
const sharp = require('sharp');

// models,
const User = require('../models/userModel');

const auth = require('../middleware/authentication');

// router app,
const router = express.Router();

const upload = multer({
    limits: {
        fileSize: 1000000,
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) return cb(new Error('Invalid file'));

        cb(undefined, true);
    },
});

router.get('/users/me', auth, async (req, res) => {
    res.send(req.user);
});

// router.get('/users/:id', async (req, res) => {
//     try {
//         const user = await User.findById(req.params.id);
//         if (!user) return res.status(404).send();

//         res.status(200).send(user);
//     } catch (err) {
//         res.status(500).send(err);
//     }
// });

router.post('/users', async (req, res) => {
    const user = new User(req.body);

    try {
        await user.save();
        const token = await user.generateAuthToken();
        res.status(201).send({ user, token });
    } catch (err) {
        res.status(400).send(err);
    }
});

router.post(
    '/users/me/avatar',
    auth,
    upload.single('avatar'),
    async (req, res) => {
        const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer();
        req.user.avatar = buffer;
        await req.user.save();
        res.status(200).send({ status: 'success' });
    },
    (err, req, res, next) => res.status(400).send({ error: err.message })
);

router.delete('/users/me/avatar', auth, async (req, res) => {
    req.user.avatar = undefined;
    await req.user.save();
    res.send({ status: 'success' });
});

router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user || !user.avatar) throw new Error('Not found!');

        res.set('Content-Type', 'image/jpg');
        res.send(user.avatar);
    } catch (err) {
        res.status(404).send(err.message);
    }
});

router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);

        const token = await user.generateAuthToken();

        res.send({ user, token });
    } catch (err) {
        res.status(400).send(err);
    }
});

router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter(token => token.token !== req.token);

        await req.user.save();

        res.send();
    } catch (err) {
        res.status(500).send();
    }
});

router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = [];
        await req.user.save('All user logged out!');

        res.send();
    } catch (err) {
        res.status(500).send();
    }
});

router.patch('/users/me', auth, async (req, res) => {
    const keys = Object.keys(req.body);
    const allowedKeys = ['username', 'email', 'password', 'age'];
    const isValidOperation = keys.every(key => allowedKeys.includes(key));

    if (!isValidOperation) return res.status(400).send({ error: 'Invalid Updates!' });

    try {
        const user = req.user;

        keys.forEach(key => (user[key] = req.body[key]));
        await user.save();

        res.status(200).send(user);
    } catch (err) {
        res.status(400).send(err);
    }
});

router.delete('/users/me', auth, async (req, res) => {
    try {
        // const user = await User.findByIdAndDelete(req.user._id);
        // if (!user) return res.status(404).send();

        await req.user.remove();

        res.status(200).send(req.user);
    } catch (err) {
        res.status(500).send(err);
    }
});

module.exports = router;
