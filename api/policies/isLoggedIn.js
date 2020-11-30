module.exports = async function (req, res, next) {
    if (req.signedCookies.user) {
      return next();
    } else {
      return res.redirect('/login');
    }
  }
  