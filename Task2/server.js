const exp = require('express');
const connectDB = require('./config/config'); 
require('dotenv').config();
const myRoutes = require('./routes/auth');
const app = exp();
const errorHandler = require('./middleware/ErrorHandling');
app.use(exp.json());
app.use('/', myRoutes);
connectDB();
app.use(exp.json());
app.listen(3000);
app.use(errorHandler)