module.exports = function(){
    var express = require('express'); //set up express engine and routing procedure
    var router = express.Router();

    //this is the default loading actions when user types in URL the this page
    router.get('/', function(req, res){ 
                res.render('Login'); //simply load the input box
    });


	//this is the default action when a POST method is invoked on the page. In this case, whenever our "login" button is clicked
   router.post('/', function(req, res){
        console.log(req.body) //for debugging only, will display what raw data(not query) is being sent to the server.
        var mysql = req.app.get('mysql')
        var sql = "SELECT CASE WHEN COUNT(fName)>0 THEN fName ELSE 0 END AS ret FROM Spoters WHERE fName=? AND lName=? AND password=?";//default queries, assume user log in as spoter
        var inserts = [req.body.fName, req.body.lName, req.body.password];
        var isShelter=0; //a flag to indicate choice
        if(req.body.shelterSpoter=='shelter')//when user log in as shelter employee, change sql commands accordingly
        {
            sql="SELECT CASE WHEN COUNT(name)>0 THEN name ELSE 0 END AS ret FROM Shelters WHERE name=? AND password=?";
            inserts = [req.body.sName, req.body.password];
            isShelter=1;
        }
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){ //if there's an error during interaction with DB
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                }
            else{ //DB interaction successful, procedd to next page
                var type=typeof(results[0].ret);
                console.log(type);
                if(results[0].ret==0)//the returned date is invalid(so password or username is incorrect), reload the page with an error prompt
                {
                    res.render('Login',{promp:'log-in failed, check your password and username'})
                }
                else{
                    if(isShelter==0){
                    res.render('Spoter',{userName:results[0].ret}); }//continue to the spoter page(the page is incomplete as of 11/24)
                    else{res.render('shelter',{shelterName:results[0].ret});}//continue to the shelter page(the page is incomplete as of 11/24)
                    }
                
                }      
            });

    });


return router;
}();