const express = require('express')
const app = express()
const port = 8080
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const { User } = require('./models/User')
const { auth } = require('./middleware/auth')
const config = require('./config/key')

app.use(bodyParser.urlencoded({extended: true})) // application/x-www-form-urlencoded 분석
app.use(bodyParser.json()); // application/json 분석
app.use(cookieParser())

const mongoose = require('mongoose')
mongoose.set('strictQuery', true)
mongoose.connect(config.mongoURI, {
    useNewUrlParser: true, useUnifiedTopology: true
}).then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err))


app.get('/', (req, res) => {
    res.send('Hello World! 안녕하세요!')
})

app.post('/api/users/register', (req, res) => {
    // 회원가입시 필요한 정보들을 client 에서 가져오면 DB에 저장한다
    const user = new User(req.body)

    user.save((err, userInfo) => {
        if(err) return res.json({success:false, err})
        return res.status(200).json({
            success: true
        })
    })
})

app.post('/api/users/login', (req, res) => {
    //요청된 이메일을 데이터베이스에서 있는지 찾는다
    User.findOne({email : req.body.email}, (err, user) => {
        if(!user) {
            return res.json({
                loginSuccess: false,
                message: "제공된 이메일에 해당하는 유저가 없습니다."
            })
        }
        //요청된 이메일이 데이터베이스에 있다면 비밀번호가 맞는 비밀번호인지 확인한다.
        user.comparePassword(req.body.password, (err, isMatch) => {
            if(!isMatch) return res.json({loginSuccess:false, message: "비밀번호가 틀렸습니다."})
        })
        //비밀번호가 갖다면 Token 을 생성한다.
        user.generateToken((err, user) => {
            if(err) return res.status(400).send(err)

            // token 을 저장한다. 어디에 ? 쿠키, 로컬 스토리지, 세션 스토리지 등
            res.cookie("x_auth", user.token).
                status(200).
                json({loginSuccess: true, userId: user._id})
        })
    })
})

// auth 는 middleware
app.get('/api/users/auth', auth, (req, res) => {
    res.status(200).json({
        _id: req.user._id,
        isAdmin: req.user.role === 0 ? false : true,
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role,
        image: req.user.image
    })
})

app.get('/api/users/logout', auth, (req, res) => {
    User.findOneAndUpdate({_id: req.user._id}, {token: ""}, (err, user) => {
        if(err) return res.json({success:false, err})
        return res.status(200).send({success:true})
    })
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})