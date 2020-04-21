This poject enhance the Single local strtegies to multiple strategies.
Use following steps to add another model in your strategy.

1: Make new model let say 'Student' in models
2: Import Model in config/passport.js
2: Mak new local strategy in config/passport.js //Copy one of already implemented and change it
3: Make another else-if in seriallize and deserialize function
4: Register routes and configure correct controllers and views etc.
5: Double check respective login controller to register success and failure paths.
6: Add forwardAuthentication and ensureAuthentication for each role as neede.
