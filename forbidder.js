module.exports = function (day) {
    var days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    return function (req, res, next) {
        var today = new Date().getDay();
        
        if (days[today] === day) {
            res.send("Sorry, no visitor is allowed today");
        } else {
            next();
        }
    };
};