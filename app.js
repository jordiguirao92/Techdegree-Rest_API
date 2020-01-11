'use strict';

//load modules
const express = require('express');
const morgan = require('morgan');
const sequelize = require('./models').sequelize;
//const Sequelize = require('sequelize')
//const sequelize = new Sequelize({dialect:'sqlite', storage:'fsjstd-restapi.db'});

const userRoutes = require('./routes/user');
const courseRoutes = require('./routes/course');

//variable to enable global error logging
const enableGlobalErrorLogging = process.env.ENABLE_GLOBAL_ERROR_LOGGING === 'true';

//create the Express app
const app = express();

//setup morgan which gives us http request logging
app.use(morgan('dev'));

//Reading all the data as a json file.
app.use(express.json());

//TODO setup your api routes here
app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);


//Checking the connection with the database.
(async () => {
  try {
    console.log('Testing the connection to the database...');

    // Test the connection to the database
    await sequelize.authenticate();
    console.log('Connection to the database successful!');

    // Sync the models
    console.log('Synchronizing the models with the database...');
    await sequelize.sync(); //await sequelize.sync({ force: true });
    console.log('Synchronize successful');


  } catch(error) {
    console.error('Error connecting to the database: ', error)
  }
})();


//setup a friendly greeting for the root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the REST API project!',
  });
});

//send 404 if no other route matched
app.use((req, res) => {
  res.status(404).json({
    message: 'Route Not Found',
  });
});

//setup a global error handler
app.use((err, req, res, next) => {
  if (enableGlobalErrorLogging) {
    console.error(`Global error handler: ${JSON.stringify(err.stack)}`);
  }

  res.status(err.status || 500).json({
    message: err.message,
    error: {},
  });
});


//set our port
app.set('port', process.env.PORT || 5000);

//start listening on our port
const server = app.listen(app.get('port'), () => {
  console.log(`Express server is listening on port ${server.address().port}`);
});
