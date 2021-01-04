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
  'GET /change': {controller: 'PageController', action: 'change'},
  'GET /logout' : {controller: 'AuthController', action: 'logout'},
  'POST /search': {controller: 'PageController', action: 'search'},
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
  'GET /:username/:setId': {controller: 'SetController', action: 'getSet'},
  'GET /:setId/edit': {controller: 'SetController', action: 'getEditSet'},
  'GET /:setId/learn': {controller: 'SetController', action: 'getSetLearn'},
  'GET /:setId/test': {controller: 'SetController', action: 'getTest'},
  'GET /:setId/write': {controller: 'SetController', action: 'getWrite'},
  'GET /:username/folders/:folderId': {controller: 'FolderController', action: 'getFolder'},

  'POST /create-set': {
    controller: 'SetController',
    action: 'createData'
  },

  'POST /add-to-folder':{
    controller: 'SetController',
    action: 'addToFolder'
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

  'POST /change': {
    controller: 'AuthController',
    action: 'change'
  },

  'POST /:setId/edit': { controller: 'SetController', action: 'postEditSet'},
  'GET /:setId/delete': { controller: 'SetController', action: 'deleteSet'},
  'GET /folders/:folderId/delete': {controller: 'FolderController', action: 'deleteFolder'},
  'GET /folders/:folderId/:setId/remove': {controller: 'FolderController', action: 'removeSet'},
  'GET /lp': {controller: 'PageController', action: 'getStarted'}
  
};
