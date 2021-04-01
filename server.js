require('dotenv').config();
const mongoose  = require('mongoose');
const express = require('express')
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const chalk = require('chalk');




const app = express();
app.use(express.json());  
app.use(cors());
app.use(cookieParser());
app.use(fileUpload({
    useTempFiles: true
}));


//Routes
app.use('/user', require('./routes/userRouter'));
app.use('/api', require('./routes/upload'));


//Connect to mongodb
const URI = process.env.MONGODB_URL;
mongoose.connect(URI, {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlparser: true,
    useUnifiedTopology:true,

}, err => {
    
    if(err)throw err;
console.log(chalk.blueBright("Connected to the Mongo DB database"))
})



app.use('/', (req, res, next) => {
    res.json({ msg: "Hello Every one"})
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(chalk.cyanBright("Server is running on PORT", PORT))
})













