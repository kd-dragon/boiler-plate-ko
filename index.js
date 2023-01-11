const express = require('express')
const app = express()
const port = 8080

const mongoose = require('mongoose')
const dbUrl = 'mongodb+srv://medium:medium1234@boilder-plate.kbhvbye.mongodb.net/?retryWrites=true&w=majority'
mongoose.connect(dbUrl, {
    useNewUrlParser: true, useUnifiedTopology: true
}).then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err))

//

app.get('/', (req, res) => {
    res.send('Hello World! 안녕하세요!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})