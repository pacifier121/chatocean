const router = require('express').Router();
const { ensureAuth, ensureGuest } = require('../middleware/auth');
const User = require('../models/User');
const bcrypt = require('bcryptjs');


router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'build', 'index.html'));
})

router.get('/login', (req, res) => {
    res.redirect('http://localhost:3000/login?msg=already')
})

router.get('/register', async(req, res) => {
    res.redirect('http://localhost:3000/register?msg=notfound');
})


// Normal form login/register
router.post('/register', async(req, res) => {
    try {
        let userDetails = req.body;
        userDetails.password = await bcrypt.hash(userDetails.password, 8);           
        let newUser = new User(userDetails);

        await newUser.save();
        res.status(200).json(newUser);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
})

router.post('/login', async(req, res) => {
    try {
       let userDetails = req.body;
       const user = await User.findOne({ email: userDetails.email });
        if (!user){
            return res.status(404).json({ err: "User not found" });
        }
       const passwordCorrect = await bcrypt.compare(userDetails.password, user.password);
        if (!passwordCorrect){
            return res.status(404).json({ err: "User not found" });
        }
       res.status(200).json(user); 
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
})


module.exports = router;
