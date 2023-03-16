require('dotenv').config();
require('express-async-errors');

// extra security packages
const helmet = require('helmet');
const cors = require('cors');
const xss = require('xss-clean');
const rateLimiter = require('express-rate-limit');


const express = require('express');
const app = express();

const connectDB = require('./db/connect');
const authenticate = require('./middleware/authentication');


const authrouter = require('./routes/auth');
const productsrouter = require('./routes/products');


// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

app.set('trust proxy', 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  })
);

app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(xss());

// extra packages


// app.get('/', (req, res) => {
//   res.send('jobs api');
// });
app.get('/', (req, res) => {
  res.send('<h1>Lucky-Sniffles Pet Store API</h1><a href="/api-docs">Documentation</a>');
});
// routes
app.use('/api/v1/auth', authrouter);
app.use('/api/v1/products', authenticate , productsrouter); 

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
