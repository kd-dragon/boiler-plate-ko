const express = require('express')
const app = express()
const port = 8080
const bodyParser = require('body-parser')
const { User } = require('./models/User')
const config = require('./config/key')

app.use(bodyParser.urlencoded({extended: true})) // application/x-www-form-urlencoded 분석
app.use(bodyParser.json()); // application/json 분석

const mongoose = require('mongoose')
mongoose.set('strictQuery', true)
mongoose.connect(config.mongoURI, {
    useNewUrlParser: true, useUnifiedTopology: true
}).then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err))


app.get('/', (req, res) => {
    res.send('Hello World! 안녕하세요!')
})

app.post('/register', (req, res) => {
    // 회원가입시 필요한 정보들을 client 에서 가져오면 DB에 저장한다
    const user = new User(req.body)

    user.save((err, userInfo) => {
        if(err) return res.json({success:false, err})
        return res.status(200).json({
            success: true
        })
    })
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})