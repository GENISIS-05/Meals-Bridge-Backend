const express = require('express')
const router = express.Router();
const { body, validationResult } = require('express-validator');
const UserOrder = require('../models/Order');
const Profile = require('../models/Profile');
var fetchuser = require('../middleware/fetchuser');


//Route 1: fetch  all UserOrder using: get "http://localhost:3000/api/userorder/fetchallUserOrder". login required


//Route 2: Add a new UserOrder using: POST "http://localhost:3000/api/userorder/addUserOrder". login required

router.post('/addUserOrder',[
    body('uid', 'Enter a valid id').isLength({ min: 1 }),
    body('image', 'Enter a valid image').isArray({ min: 1 }),
    body('foodname', 'Enter a valid foodname').isArray({ min: 1 }),
    body('quantity', 'Enter a valid quantity').isArray({ min: 1 }),
    // body('status', 'Enter a valid status').isArray({ min: 0 }),
] ,async (req, res) => {
    try {
        // check if the user already exists
        const existingUser = await Profile.findOne({ uid: req.body.uid });
        if (!existingUser) {
            return res.status(400).json({ error: "Sorry, a user with this id does not exists" });
        }
        const { uid, image, foodname, quantity, status } = req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const userorder = new UserOrder({ uid, image, foodname, quantity, status });
        const savedUserOrder = await userorder.save();
        res.json(savedUserOrder);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})


module.exports = router;