const express = require('express')
const router = express.Router();
const { body, validationResult } = require('express-validator');
const UserOrder = require('../models/Order');
const Profile = require('../models/Profile');
var fetchuser = require('../middleware/fetchuser');
const { v4: uuidv4 } = require('uuid');

//Route 1: fetch  all UserOrder using: get "http://localhost:3000/api/order/fetchsingleUserOrder/:id". login required
router.get('/singleOrder/:id', async (req, res) => {
    try {
        const userorder = await UserOrder.find({ oid: req.params.id });
        if (!userorder) {
            return res.status(404).send("Not Found");
        }
        res.json(userorder);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

//Route 2: on call return location and uid and oid by filtering only status pending order using: get "http://localhost:3000/api/order/fetchUserOrder". login required



//Route 2: Add a new UserOrder using: POST "http://localhost:3000/api/order/addUserOrder". login required

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
        const shortUuid= `GN${uuidv4()}`;
        const oid = shortUuid.substr(0, 6);
        const userorder = new UserOrder({ uid,oid, image, foodname, quantity, status });
        const savedUserOrder = await userorder.save();
        res.json(savedUserOrder);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})


module.exports = router;