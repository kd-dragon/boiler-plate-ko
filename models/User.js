const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
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

userSchema.methods.comparePassword = function(plainPassword, cb) {
    // plainPassword 평문패스워드
    bcrypt.compare(plainPassword, this.password, function(err, isMatch){
        if(err) return cb(err), cb(null, isMatch)
    })
}

userSchema.methods.generateToken = function (cb) {
    let user = this

    //jsonwebtoken 을 이용해서 토큰 생성하기
    let token = jwt.sign(user._id.toHexString(), 'secretToken')

    user.token = token
    user.save(function (err, user) {
        if(err) return cb(err)
        cb(null, user)
    })
}

userSchema.statics.findByToken = function(token, cb) {
    let user = this

    jwt.verify(token, 'secretToken', function(err, decoded) {
        // user id 로 유저를 찾은 뒤 클라이언트(쿠키)에서 가져온 토큰과 비교한다.

        user.findOne({"_id":decoded, "token":token}, function(err, user) {
            if(err) return cb(err)
            cb(null, user)
        })
    })
}

// 스키마를 모델로 감싸준다.
const User = mongoose.model('User', userSchema)

// 다른 곳에서 쓸 수 있게끔 모델을 export 해준다.
module.exports = {User}
