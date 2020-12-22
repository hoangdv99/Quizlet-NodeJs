module.exports = async function (req, res, next) {
    if (req.signedCookies.user) {
      console.log(req.signedCookies.user);
      return next();
    } else {
      return res.redirect('/login');
    }
  }
  