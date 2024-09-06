const express = require('express')
const app = express()
const cors = require('cors')
const MongDB = require('./Database')
const cookieParser = require('cookie-parser')
require('dotenv').config()
const port = process.env.PORT || 8000
const frontend = process.env.FrontEnd

//--------  Router Definations  ---------------------------------------------//
const UserRouter = require('./Routes/UserRoute')
const AuthenticationRouter = require('./Routes/authenticaionRoute')
const BlogRouter = require('./Routes/BlogRoute')
const ProfileRouter = require('./Routes/ProfileRoute')






app.use(express.json())
MongDB();
const allowedOrigins = [
    frontend,
    'https://talk-threads-rose.vercel.app'
];


app.use(cors({
    origin: function (origin, callback) {
        if (allowedOrigins.includes(origin) || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ['Content-Type', 'accessToken', 'refreshToken'],
    credentials: true
}))
app.use(cookieParser())



app.get('/', (req, res) => {
    res.status(200).send(`Backend is running in port ${port}`)
})






//--------  Router Calls  ---------------------------------------------//

app.use('/auth', UserRouter)
app.use('/auth', AuthenticationRouter)
app.use('/api', BlogRouter)
app.use('/api', ProfileRouter)








app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
