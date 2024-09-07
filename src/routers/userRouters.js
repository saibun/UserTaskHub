const userModel = require("../models/user");
const express = require("express");
const auth = require("../middlewares/auth");
const router = express.Router();

router.post('/users', async (req, res) => {
    try {
        //create a instance of user model
        const user = new userModel(req.body);

        //save that instance
        const saved_user = await user.save();
        await user.getAuthToken();
        if (!saved_user) {
            return res.status(400).send("Worng input");
        }
        res.status(200).send(saved_user);

    } catch (err) {
        res.status(500).send(err.message);

    }

})

// router.get('/users/:id', async (req, res) => {
//     const userId = req.params.id;

//     //writting query to search a user by its id
//     try {
//         const user = await userModel.findById(userId);
//         if (!user) {
//             return res.status(400).send("Wrong Input");
//         }
//         res.status(200).send(user);
//     } catch (err) {
//         res.status(500).send("Server Error");
//     }

// })

router.get('/users', async (req, res) => {
    try {
        const users = await userModel.find();
        if (!users) {
            return res.status(400).send("No record Found")
        }
        res.status(200).send(users);

    } catch (err) {
        res.status(500).send("Server Error");
    }
})

router.patch('/users/update',auth, async (req, res) => {

    try {
        const update_properties = ['user_name', 'age', 'email', 'password'];
        const req_update = Object.keys(req.body);
        const is_present = req_update.every((value) => update_properties.includes(value));
        const user = req.user;
        if (!is_present || !user) {
            return res.status(400).send("Not Found");
        }
        req_update.forEach(element => {
            user[element] = req.body[element];

        });
        await user.save();
        res.status(200).send(user);


    } catch (err) {
        res.status(500).send("Server Error");

    }

})

router.delete("/users/delete",auth, async (req, res) => {
    try {
        const user = req.user;
        await userModel.findByIdAndDelete(user._id);
        if (!user) {
            res.status(404).send();
        }
        res.status(202).send();

    } catch (err) {
        res.status(500).send()
    }

})

router.post("/users/login", async (req, res) => {
    try {
        const user = await userModel.findCredentials(req.body.email, req.body.password);
        const token = await user.getAuthToken();
        res.status(200).send({ user, token });
    } catch (err) {
        res.status(404).send();
    }
})

//----- User authentication-----------------------------------------
router.get("/auth", auth, (req, res) => {
    res.send(req.user); 


})

//------------ Log Out---------------------
router.post("/users/logout", auth, async(req, res) => {
    try {
        const user = req.user;
        user.tokens = user.tokens.filter(value =>value.token != req.token);
        await user.save();
        res.status(200).send();

    } catch (err) {
        res.status(400).send(err);
    }

})

//----Log out all season-------------------
router.post("/users/logoutAll", auth, async(req, res) => {
    try {
        const user = req.user;
        user.tokens = [];
        await user.save();
        res.status(200).send();

    } catch (err) {
        res.status(400).send(err);
    }

})




module.exports = router;