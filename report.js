module.exports = function(){
    var express = require('express'); 
    var router = express.Router();

    router.get('/', function(req, res){ 
        var context = { currentDate: new Date()};
        res.render('Report', context);
    });

return router;
}();