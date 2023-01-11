const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    name : {
        type: String,
        maxLength: 50
    },
    email: {
        type: String,
        trim: true,
        unique: 1
    },
    password: {
        type: String,
        minLength: 5
    },
    lastname: {
        type: String,
        maxLength: 5
    },
    role: {
        type: Number,
        default: 0,
    },
    image: String,
    token: {
        type: String
    },
    tokenExp: {
        type: Number
    }
})

// 스키마를 모델로 감싸준다.
const User = mongoose.model('User', userSchema)

// 다른 곳에서 쓸 수 있게끔 모델을 export 해준다.
module.exports = {User}
