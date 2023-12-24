const express = require('express');
const dbConnect = require('./database/index');
const App = express();
const {PORT} = require('./config/index');
const router = require('./routes/index');
const errorHandler = require('./middlewares/errorHandler');
const cookieParser = require('cookie-parser');

App.use(cookieParser());
App.use(express.json());
App.use(router);
dbConnect();

App.use('/storage', express.static('storage'));

App.use(errorHandler);

App.listen(PORT,console.log(`app is running at PORT ${PORT}`));
