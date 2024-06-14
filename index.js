const express = require('express');
const {connectDb} = require("./utils/db")
const userRoutes = require('./routes/userRoutes');
const discussionRoutes = require('./routes/discussionRoutes');
const cors = require('cors');

const app = express();


app.get('/',(req,res)=>{
    res.status(200).json("server running")
})

app.use(cors());
app.use(express.json());
app.use('/users', userRoutes);
app.use('/discussions', discussionRoutes);

connectDb()
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
