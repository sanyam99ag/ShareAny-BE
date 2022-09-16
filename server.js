const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');

const PORT = process.env.PORT || 3000;

const connectDB = require('./config/db');
connectDB();

app.use(express.static('public'));

app.use(express.urlencoded({ extended: false }))
app.use(express.json());

// Template Engine
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs')

// CORS SETUP
const corsOptions = {
    origin: process.env.ALLOWED_CLIENTS.split(',')
}
app.use(cors(corsOptions));



// Routes
app.use('/api/files', require('./routes/files'));
app.use('/files', require('./routes/show'));
app.use('/files/download', require('./routes/download'));




app.listen(PORT, () => {
    console.log(`Listening to port ${PORT}`);
})