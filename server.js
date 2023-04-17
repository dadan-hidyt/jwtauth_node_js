require('dotenv').config();
const express = require('express');
const cors = require('cors')
const bodyParser = require('body-parser')
const Router = require('./Router');
const app = express();


const PORT = process.env.PORT;

app.use(bodyParser.json())
app.use(cors());

app.use('/api', Router);

app.listen(PORT, function(){
    console.log("LISTEN"+PORT)
});
