/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {

  /***************************************************************************
  *                                                                          *
  * Make the view located at `views/homepage.ejs` your home page.            *
  *                                                                          *
  * (Alternatively, remove this and add an `index.html` file in your         *
  * `assets` directory)                                                      *
  *                                                                          *
  ***************************************************************************/

  'GET /': { controller: 'PageController', action: 'home' },
  'GET /login': { controller: 'PageController', action: 'login' },
  'GET /register': {controller: 'PageController', action: 'register'},
  'GET /logout' : {controller: 'AuthController', action: 'logout'},

  /***************************************************************************
  *                                                                          *
  * More custom routes here...                                               *
  * (See https://sailsjs.com/config/routes for examples.)                    *
  *                                                                          *
  * If a request to a URL doesn't match any of the routes in this file, it   *
  * is matched against "shadow routes" (e.g. blueprint routes).  If it does  *
  * not match any of those, it is matched against static assets.             *
  *                                                                          *
  ***************************************************************************/
  'GET /:username/profile': { controller: 'ProfileController', action: 'getProfile'},
  'GET /:username/create-set': {controller: 'SetController', action: 'getCreateSet'},
  'GET /:username/:title': {controller: 'SetController', action: 'getSet'},
  'GET /:title/edit': {controller: 'SetController', action: 'getEditSet'},
  'GET /:title/learn': {controller: 'SetController', action: 'getSetLearn'},
  'GET /:title/test': {controller: 'SetController', action: 'getTest'},
  'GET /:title/write': {controller: 'SetController', action: 'getWrite'},
  'GET /:username/folders/:folderId': {controller: 'FolderController', action: 'getFolder'},

  'POST /create-set': {
    controller: 'SetController',
    action: 'createData'
  },

  'POST /add-sets': {
    controller: 'FolderController',
    action: 'addSets'
  },

  'POST /create-folder': {
    controller: 'FolderController',
    action: 'createFolder'
  },

  'POST /login': {
    controller: 'AuthController',
    action: 'login'
  },

  'POST /register': {
    controller: 'AuthController',
    action: 'register'
  },

  'POST /:title/edit': { controller: 'SetController', action: 'postEditSet'},
  'GET /:title/delete': { controller: 'SetController', action: 'deleteSet'},
  'GET /folders/:folderId/delete': {controller: 'FolderController', action: 'deleteFolder'},
  'GET /folders/:folderId/:setId/remove': {controller: 'FolderController', action: 'removeSet'}
};
