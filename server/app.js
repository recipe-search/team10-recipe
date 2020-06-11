if (process.env.NODE_ENV == 'development') {
    require('dotenv').config();
}
const express = require('express');
const app = express();
const port = process.env.APP_PORT;
const routes = require('./routers');
const errorHandler = require('./middlewares/errorHandler');
const cors = require('cors');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(routes);
app.use(errorHandler);

app.listen(port, () => console.log(`Please check http://localhost:${port}/`));
