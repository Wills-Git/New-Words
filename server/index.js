const express = require('express')
const PORT = 1234
const path = require('path')
const auth = require('./routes/auth')

const app = express()
app.use(express.json())

app.use('/auth', auth)

app.get('/', (req,res) => {
    res.send('howdy howdy')
})



app.listen(PORT)