const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRouters');
const app = express();
const PORT = 3000;
const cors = require('cors');
app.use(cors());  



app.use(express.json());

mongoose.connect('mongodb://localhost:27017/webTask')
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.error("MongoDB connection error:", err));


app.use('/users', userRoutes);


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
