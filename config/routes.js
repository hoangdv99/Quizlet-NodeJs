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

  'GET /': { view: 'pages/homepage' },


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
  'GET /create-set': {view: 'pages/create-set'},
  'GET /profile': {view: 'pages/profile'},
  'GET /folders': {view: 'pages/folder'},
  'GET /sets': {view: 'pages/set', locals: {layout: null}},
  'GET /learn': {view: 'pages/learn', locals: {layout: null}},
  'GET /sign-in' :{view: 'pages/sign-in', locals: {layout: null}},
  'GET /sign-up' :{view: 'pages/sign-up', locals: {layout: null}}
};
