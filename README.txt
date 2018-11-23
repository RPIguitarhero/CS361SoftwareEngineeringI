To test this module:
1. clone it to your local repo/school server
2. use "npm install" to install the node manager
3. use "node main.js xxxx" to start hosting, xxxx is the port number you are using. 
4. type in "Index" after whatever your testing URL is and hit Enter. For example, I used "localhost:1000/Index" to test current module on my laptop.

About DB:
1.You can view the SQL queris under file "database_creation.sql", if you want to use it on your DB server, remember to exclude the comments followed by "--"
2.Current DB has 5 entities: shelters, spoters, address, reports, reportLinkage.
3.there is also a schema to better explain the relationships named "DB_schema.png".
4.Only queries about basic setups and account creation are implemented now, there are more implementation queris to be done.(For example, generate a report after user submission). You can view them under "Index.js".
5.Professor Terry just gave everyone DB access for CS361, I used mine to host the current DB.

Kai-Nov 15

Updates NOV 24
1.the pages are now refactored; spoters, shelters, log-in, register pages are now separated and connected.
2.Log-in process is implemented, but it is not using session/cookie, which makes it unsafe. If I had the time I would learn related related PHP stuff to make it better.
3.added missing attributes such as "email" and "phone number".
4.tried my best at layout and aesthetics.

TO-DO
1.finish report page for spoters and shelter employees.
2.visual improvements in general. 