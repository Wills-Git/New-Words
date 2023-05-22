const express = require('express')
const router = express.Router();


router.get('/', (req,res, next) => {
    res.json([
        {
            username: 'me',
            age:20
        },
        {
            username: 'me2',
            age:21
        },
    ])
    next()
})

module.exports = router