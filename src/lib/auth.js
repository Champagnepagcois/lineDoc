module.exports = {
    isLoggedIn (req, res, next) {
        if (req.isAuthenticated()) {
            return next ();
        }
        return res.redirect('/profile');
    },

    isNotLoggedIn(req, res, next) {
        if (!req.isAuthenticated()) {
            return next ();
        }
        return res.redirect('/profile');
    },

    isLoggedInUser (req, res, next) {
        if (req.isAuthenticated()) {
            const userType = req.session.passport.user.userType;
            if (userType == 1) {
                return res.redirect('/');
            }
            if (userType == 2) {
                return next();
            }
        }
    },

    isLoggedInDoc (req, res, next) {
        if (req.isAuthenticated()) {
            const userType = req.session.passport.user.userType;
            if (userType == 1) {
                return next();
            }
            if (userType == 2) {
                return res.redirect('/');
            }
        }
    },

    
   
};