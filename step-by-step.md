Step 00: Create project folder locally and link it to Github
-------------------------------------------------------------
    On your MAC
      `mkdir okodin						
      	cd okodin							
      	git init							
      	touch README.md							
      	open README.md	Add some text						
      	git status							
      	git add .							
      	git commit -m "Created README.md file"`							
    On Github	Create a repository called *okodin*							
    	Grab the repo URL https://github.com/deven1/okodin							
    On your MAC
        `git remote add origin https://github.com/deven1/okodin							
    	   git push -u origin master`

Step 0: Initialize and install requirements: (ignore ` ` used for highlight code)
---------------------------------------------------------------------------------
        `npm init`
            -- this will create package.json

        `npm install --save body-parser cookie-session express express-flash-messages faker express-session`
        `npm install --save express-handlebars  morgan pg pg-hstore sequelize sequelize-cli fs path`
        `npm install cookie-parser`
              -- this list varies based on application's requirements
              -- this will install all required packages in node_modules\ folder
                  and will list them all under "dependencies" in package.json

        `sequelize init`
            -- this will create sequelize structure:
                  - config/config.json
                        - Where you configure database connection info
                          for each environment
                        `"username": devenbhatt`  
                        `"database": "okodin"` under "development"
                        `"database": "okodin"` under "test"
                        `"dialect": "postgres"` under all 3 cases
                  - models/: The folder where your models are created
                  - models/index.js: The file that handles loading all models
                              for you to require and connecting to the database
                  - migrations/: The folder that stores your migration files
                  - seeders/: The folder that stores your seed files

        `touch .gitignore`
            --> add this in the file:
                node_modules\ --> to prevent uploading that folder to github on commits
                config\  --> to prevent uploading database config file details

Step 1: Create Database
-----------------------
    Start postgres app and launch a new shell terminal and type $psql.
    NOTE: postgres converts all uppercases into lowercases, so do not use any uppercase letter
          in database name.

    $ `psql`
          devenbhatt=# `CREATE DATABASE okodin;`  <-- Note: ';' needed

          :`quit;`    <-- Note: ';' needed

Step 2: Create Migration Files
------------------------------
    $ `sequelize model:create --name User --attributes "username:string email:string profileId:integer lastLogin:date"`

      --> this will create `user` template files in migrations\ and models\ folders

    $ `sequelize model:create --name Profile --attributes "age:integer gender:string maritalStatus:string height:integer bodyType:string children:integer occupation:string about:text talents:array(text) favorites:array(text) whyMe:text pets:string photo:text distance:integer city:string userId:integer"`

      --> this will create `profile` template files in migrations\ and models\ folders

    Change `ARRAY(TEXT)` to `ARRAY(DataTypes.TEXT)` for talents and favorites attributes in profile.js model file.

    Change `ARRAY(TEXT)` to `ARRAY(Sequelize.TEXT)` for talents and favorites in profile.js migration file.

    Change the createdAt and updatedAt default code in all migration files as below:
              `createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.fn('NOW')`    <--- This is the only change
              `},
              updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.fn('NOW')`    <--- This is the only change
              `}`

Step 3: Define Associations in the Models files
----------------------------------------------
    user.js
          `classMethods: {
            associate: function(models) {
              User.hasOne(models.Profile, {
                foreignKey: "userId"
              });
            }`
    profiles.js
          `classMethods: {
            associate: function(models) {
              Profile.hasOne(models.User, {
                foreignKey: "profileId"
              });
            }`

Step 4: Modify default Attribute definitions by including Validations for each Attribute in each Model file as shown in sample below:
-----------------------------------------------------------------------------------------------------------
          `var users = sequelize.define(
            users,
            {
              username: {
                type: DataTypes.STRING,
                validate: {
                  notEmpty: {
                    msg: "Username cannot be empty"
                  }
                }
              },
              email: {
                type: DataTypes.STRING,
                validate: {
                  notEmpty: {
                    msg: "Email cannot be empty"
                  },
                  isEmail: {
                    msg: "Email is invalid"
                  }
                }
              },`

Step 5: Run Migrations to create tables in the database
-------------------------------------------------------
        $ `sequelize db:migrate`

Step 6: Create Seed files and insert seed logic in the default template
-----------------------------------------------------------------------
        $ `sequelize seed:create --name User`

          --> Open seeders\xxxx.User.js, and write the seeding logic (something like below) in the 'up' section:
              `up: function(queryInterface, Sequelize) {
                var users = [];
                for (let i = 1; i < 501; i++) {
                  let firstName = faker.name.firstName();
                  let lastName = faker.name.lastName();
                  users.push({
                    username: `${firstName}.${lastName}`,
                    email: faker.internet.email(),
                    profileId: i,
                    lastLogin: faker.date.past()
                  });
                }
                return queryInterface.bulkInsert("Users", users);`

        $ `sequelize seed:create --name Profile`

          --> Open seeders\xxx.Profile.js, and write the seeding logic in the 'up' section.

Step 7: Run Seed file to seed the database
------------------------------------------
  OPTION A (manual):
  -----------------
      $ `sequelize db:seed:all`

  OPTION B (via script):
  ----------------------
    **Add following to 'scripts' in package.json to be able to use "npm run seed" to undo migrations, run migrations, and seed all:

    "seed": "sequelize db:migrate:undo:all && sequelize db:migrate && sequelize db:seed:all"
    ***
    Then:
      $ `npm run seed`

Step 8: Query the database to check for seeded data
---------------------------------------------------
  OPTION A (manual):
  -----------------
      $ `psql`
          psql (9.6.2)
          Type "help" for help.
          devenbhatt=#
                  `\l ` -- to list all databases
                  `\c okodin`
                        You are now connected to database "okodin" as user "devenbhatt".
                  `\dt`  -- to list all tables in this database
                  `\d+ "Users"` -- list all details of table
                  `SELECT * FROM "Users";`  -- will list all columns

  OPTION B (via script):
  ----------------------
    Add repl.js to the root directory.

    **Add following to 'scripts' in package.json to be able to use "npm run c" to query the database:

    "c": "node repl.js"
    ***
    Then:
      $ `npm run c`
        > `User`
        > `User.findAll().then(lg);`
              --> this will list all Users info
        > `Profile.findAll().then(lg);`

Step 9: Create the program code in following sequence:
------------------------------------------------------
  Create `app.js` in root folder
      - Write the basic code to start the server
  Create `helpers/` folder
      - Create *URL Helper* files in this folder to refer paths in an abstracted way.
  Go back to app.js
      - Setup handlebars
      - Setup body-parser and cookie-parser
      - Write *Method Overriding* code
      - Add the console logging npm package called Morgan
      - Set up serving static middleware
      - Define and initialize sessions
  Create `views/layouts/` folder to create default base template page:
      - Create `application.hbs`
  Create `views/shared/` folder to create shared partials:
      - Create `_nav.hbs`
  Create `public/stylesheets` folder
      - Create styles.css file for nav bar styling
  Create `public/images` folder
      - Add images here
  Create `views/login/` folder to create login page:
      - Create `index.hbs`
  Go back to app.js
      - Check if session is set previously and redirect to login page if not.
  Create `routes/` folder
      - Create index.js route file
  Create `views\users` folder
      - Create `index.hbs` to show list of all users
      - Create `show.hbs` to show details of particular user
      - Create `edit.hbs` to edit details of a particular user
  Go to `routes` folder
      - Create `users.js` route file
  Go back to app.js
      - Require the routes file in app.js and then invoke `app.use()` with the specific routes
      - Add error handling code in app.js and `error.hbs` under views folder.
