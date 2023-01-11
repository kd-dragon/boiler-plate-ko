const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const saltRounds = 10

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

// 저장하기전 기능 설정
userSchema.pre('save', function(next){
    let user = this; // 해당 스키마 인스턴스를 가져온다.

    // 변경이 일어날때마다 비밀번호를 암호화 할 수 있으므로 비밀번호가 바뀔때만 동작되도록 조건문 선언
    if(user.isModified('password')) {
        console.log(`######### DEBUGGING 1 #########`)
        // 비밀번호를 암호화 시킨다
        bcrypt.genSalt(saltRounds, function (err, salt) {
            console.log(`######### DEBUGGING 2 #########`)
            if (err) return next(err)

            bcrypt.hash(user.password, salt, function (err, hash) {
                console.log(`######### DEBUGGING 3 #########`)
                if (err) return next(err)
                user.password = hash // 암호화 성공시 hash 된 비밀번호로 교체
                next()
            })
        })
        console.log(`######### DEBUGGING 4 #########`)
    } else {
        next()
    }
    console.log(`######### DEBUGGING 5 #########`)
})
// *주의) 비동기 호출로 인해 실제 수행순서는 1-4-5-2-3

// 스키마를 모델로 감싸준다.
const User = mongoose.model('User', userSchema)

// 다른 곳에서 쓸 수 있게끔 모델을 export 해준다.
module.exports = {User}
