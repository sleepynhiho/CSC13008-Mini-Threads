const express = require('express');
const path = require('path');
const ejsLayouts = require('express-ejs-layouts');
const session = require('express-session');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const multer = require('multer');

// Kết nối với cơ sở dữ liệu MongoDB
dotenv.config();
const connectToMongo = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('SUCCESSFULLY CONNECTED TO MONGO DB');
    } catch (error) {
        console.error('FAILED TO CONNECT TO MONGO DB', error);
    }
};
connectToMongo();

const app = express();

// Cấu hình CORS để chấp nhận kết nối từ frontend
const corsOptions = {
    origin: process.env.API_URL || 'http://localhost:3000',
    credentials: true,
    optionSuccessStatus: 200,
    methods: ['GET', 'POST', 'DELETE', 'PUT'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));

// Cài đặt các middleware
app.use(express.static(path.join(__dirname, 'Public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Cài đặt EJS view engine và layouts
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(ejsLayouts);

// Cài đặt session
app.use(
    session({
        secret: 'your-secret-key',
        resave: false,
        saveUninitialized: true,
    }),
);

// Cấu hình các route
const searchRoutes = require('./Routes/searchRoutes');
const homeRoutes = require('./Routes/homeRoutes');
const activityRoutes = require('./Routes/activityRoutes');
const authRoutes = require('./Routes/authRoutes');
const profileRoutes = require('./Routes/profileRoutes');
const postRoutes = require('./Routes/postRoutes');
const uploadRoutes = require('./Routes/uploadRoutes');

// Cài đặt các routes
app.use('/search', searchRoutes);
app.use('/', homeRoutes);
app.use('/activity', activityRoutes);
app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);
app.use('/post', postRoutes);
app.get('/go-to-signup', (req, res) => {
    res.redirect('/auth/signup');
});
app.use('/upload', uploadRoutes);
app.use((req, res, next) => {
    res.status(404).render('404', { layout: false });
});
// Khởi động server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
