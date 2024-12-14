const User = require('../models/model');


exports.createUser = async (req, res) => {
  console.log("in create user")
    try {
        const user = new User(req.body);
        await user.save();
        res.status(201).json({ message: 'User created successfully', user });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};


exports.getUsers = async (req, res) => {
  console.log("in get users")
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


exports.getUserById = async (req, res) => {
    try {
        const userId = req.params.id;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

       
        res.status(200).json(user);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ message: 'Server error' });
    }
};



exports.updateUser = async (req, res) => {
    const { id } = req.params;
    const { name, email, age } = req.body;

    try {
        const updatedUser = await User.findByIdAndUpdate(id, { name, email, age }, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(updatedUser); 
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error updating user' });
    }
};



exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByIdAndDelete(id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
