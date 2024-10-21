const Admin = require('../models/Admin');

// Add Admin
const addAdmin = async (req, res) => {
    const { name, email, password } = req.body;
    const newAdmin = new Admin({ name, email, password });
    try {
        await newAdmin.save();
        res.send("Admin added");
    } catch (err) {
        res.status(400).send(err);
    }
};

module.exports = {
    addAdmin
};
