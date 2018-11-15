module.exports = function(){
    var express = require('express'); //set up express engine and routing procedure
    var router = express.Router();

    //display address,spoters, and shelters
        function getAddress(res, mysql, context, complete){
        mysql.pool.query("SELECT locID, street, city,state,zip FROM Address", function(error, results, fields){
            if(error){ //error handlers, notifty the error when something goes wrong in query
                res.write(JSON.stringify(error));
                res.end();
            }
            context.Address  = results; //"get" the requiring information and put it on HTML, "context" is the body being here parsed from HTML.
                                        //note that since we are displaying all the entries from address, we can simply store the result object as a parsing context element named "Address" on HTML 
            complete(); //basically increment a counter variable named "complete" when successful
        });
    }

        function getSpoters(res, mysql, context, complete){
        mysql.pool.query("SELECT fName, lName, locID, password FROM Spoters", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.Spoters  = results;
            complete();
        });
    }

        function getShelters(res, mysql, context, complete){
        mysql.pool.query("SELECT name, locID, password FROM Shelters", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.Shelters  = results;
            complete();
        });
    }

    //a helper function to get the latest locID
    function getlastAddressID(res, mysql, context,complete ){
        mysql.pool.query("SELECT MAX(locID) AS retID FROM Address", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.lastID=results[0].retID; //update the latest ID from DB, because we are requesting a single attribute from a single entry, we need to specify it more
            complete();
        });
    }
    //this is the default loading actions when user types in URL the this page
    router.get('/', function(req, res){ 
        var callbackCount = 0; //this is the variable that will be incremented by the complete() functions in every getXXXX function
        var context = {};
        context.jsscripts=[];//this is an extra field for your js scripts. We will probably write additional AJAX scipts and connect them from here. For now it is empty
        var mysql = req.app.get('mysql');
        getSpoters(res, mysql, context, complete); //call the getXXXX functions, note that callbackCount will be increased to 4 after these function calls
        getShelters(res, mysql, context, complete);
        getAddress(res, mysql, context, complete);
        getlastAddressID(res, mysql, context,complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 4){
                res.render('Index', context); //after these function calls, we will basically refresh the page with the updated context
            }

        }
    });


	//this is the default action when a POST method is invoked on the page. In this case, whenever our "submit" button is clicked
   router.post('/', function(req, res){
        console.log(req.body) //for debugging only, will display what raw data(not query) is being sent to the server.
        var mysql = req.app.get('mysql')
        //this is the SQL query that will be sent, note that the 4 question marks are used for security and actual arguments are passed in the following variable "inserts"
        var sql = "INSERT INTO Address (street, city, state, zip) VALUES (?,?,?,?)";//send the addressing adding query first, because address has a child key "locID" for shelters and spoters
                                                                                    //in other words, we must have a valid locID before actually creating a shelter/spoter entry
        var inserts = [req.body.inputStreet, req.body.inputCity, req.body.inputState, req.body.inputZip];//the actual arguments are here, note that they are from the parsed body.
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){ //same as the previous get functions, return error when necessary
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
                }
            });
    
        //insert to Spoter or Shelter depending on user selection
        console.log(req.body.shelterSpoter); //DEBUG:check if the selection option is read correctly
        var newID=parseInt(req.body.ID)+1; //increment the hidden locID by 1 because it was the latest ID before address creation.
        console.log(newID);//DEBUG:check if new address ID is read correctly
        var sql2="INSERT INTO Spoters (fName,lName,locID,password) VALUES (?,?,?,?)";//add to Spoters by default
        var inserts2 = [req.body.fName, req.body.lName, newID, req.body.password];
        if(req.body.BoS=='shelter')//if shelter is selected, change queries accordingly
        {
        sql2="INSERT INTO Shelters (name,locID,password) VALUES (?,?,?)";
        inserts2=[req.body.sName,newID,req.body.password];
        } 
        
        sql2 = mysql.pool.query(sql2,inserts2,function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            } else{ //at this point, all the queries have been sent to DB. To see the updates, we need to "refresh" our page. 
                res.redirect('/Index'); //we are not use render() because we are not parsing any "context" here
            }       
        });

    });




return router;
}();