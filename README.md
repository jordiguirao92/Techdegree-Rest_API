
# Full Stack JavaScript Techdegree v2 - REST API Project

 I have created a REST API using Express. The API will provide a way for users to administer a school database containing information about courses: users can interact with the database by retrieving a list of courses, as well as adding, updating and deleting courses in the database. In addition, the project will require users to create an account and log-in to make changes to the database.

## Getting Started

1. Download the project.
2. Go to the root project directory.
3. Run `npm install` in order to install all the requiered dependencies.
4. Run in the terminal `npm start` and enjoy.
5. The Library Manager is going to run in http://localhost:5000/.
6. Also you can use Postman with the `RESTAPI.postman_collection.json` file with the requests that you can use to test and explore your REST API.


## Overview of the Provided Project Files

We've supplied the following files for you to use: 

* The `seed` folder contains a starting set of data for your database in the form of a JSON file (`data.json`) and a collection of files (`context.js`, `database.js`, and `index.js`) that can be used to create your app's database and populate it with data (we'll explain how to do that below).
* We've included a `.gitignore` file to ensure that the `node_modules` folder doesn't get pushed to your GitHub repo.
* The `app.js` file configures Express to serve a simple REST API. We've also configured the `morgan` npm package to log HTTP requests/responses to the console. You'll update this file with the routes for the API. You'll update this file with the routes for the API.
* The `nodemon.js` file configures the nodemon Node.js module, which we are using to run your REST API.
* The `package.json` file (and the associated `package-lock.json` file) contain the project's npm configuration, which includes the project's dependencies.
* The `RESTAPI.postman_collection.json` file is a collection of Postman requests that you can use to test and explore your REST API.

## Getting Started

To get up and running with this project, run the following commands from the root of the folder that contains this README file.

First, install the project's dependencies using `npm`.

```
npm install

```

Second, seed the SQLite database.

```
npm run seed
```

And lastly, start the application.

```
npm start
```

To test the Express server, browse to the URL [http://localhost:5000/](http://localhost:5000/).
