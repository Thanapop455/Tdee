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
const dashboardRoutes = require('./routes/dashboard');
app.use('/api/dashboard', dashboardRoutes);
app.use("/api/visitor", require("./routes/visitor"));

    
app.listen(5001,
    () => console.log('Server running port 5001'))


