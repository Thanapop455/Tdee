const express = require('express')
const app = express()
const morgan = require('morgan')
const { readdirSync } = require('fs')
const cors = require('cors')
const { log } = require('console')


app.use(morgan('dev'))
app.use(express.json({ limit: '20mb' }))
app.use(cors())


readdirSync('./routes')
    .map((c) => app.use('/api', require('./routes/' + c)))

// Step 3 Router
// app.post('/api',(req,res)=>{
//     // code
//     const { username,password } = req.body
//     console.log(username,password)
    // res.send('โย่วๆๆ')
// })
// Step 2 Start Server

const dashboardRoutes = require('./routes/dashboard');
app.use('/api/dashboard', dashboardRoutes);
app.use("/api/visitor", require("./routes/visitor"));

    
app.listen(5001,
    () => console.log('Server running port 5001'))


