require('dotenv').config();
require('express-async-errors');


const express = require('express');
const app = express();

const connectDB = require('./db/connect');
const authenticate = require('./middleware/authentication');


const authrouter = require('./routes/auth')
const productsrouter = require('./routes/products')


// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

app.use(express.json());
// extra packages


// app.get('/', (req, res) => {
//   res.send('jobs api');
// });

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
