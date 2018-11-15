CREATE TABLE Address --put address in a separate table for easier access. This table will also store the location returned by GPS
(
    locID int(20) NOT NULL auto_increment primary key,
    street varchar(50) NOT NULL, --could add more lines if we want to
    city varchar(50) NOT NULL,
    state varchar(50) NOT NULL,
    zip int(20) NOT NULL
);

INSERT INTO Address(street,city, state, zip)
    Values ('1st ave',  'Birmingham', 'AL',321),
           ('5th ave', 'Newport', 'OR', 413),
           ('9th ave', 'Flagstaff', 'AZ',8783),
           ('97 Central Blvd', 'Boston', 'MA',6579);

CREATE TABLE Spoters  --for users who spot and report strays
(
    spoID int(20) NOT NULL auto_increment primary key, --ID doesn't have to be limited to 20 digits,I set it for some restrictions 
    fName varchar(50) NOT NULL,  --same as ID, names don't have to 50 chars long
	lName varchar(50) NOT NULL,
	password varchar(20) NOT NULL, --data type is varchar to allow all potential chars for password 
   	locID int(20) NOT NULL,  --must have a registered location
    FOREIGN KEY (locID) REFERENCES Address(locID)
);

INSERT INTO Spoters(fName,lName,password,locID) --sample entry
    Values ('John',  'Smith', '12345',1);


CREATE TABLE Shelters  --for shelter users 
(
    sheID int(20) NOT NULL auto_increment primary key, 
	name varchar(50) NOT NULL,  --shelter is an organization and should only have 1 name 
	password varchar(20) NOT NULL, 
    locID int(20) NOT NULL,  
    FOREIGN KEY (locID) REFERENCES Address(locID)
);

INSERT INTO Shelters(Name,password,locID) 
    Values ('Tom', '12345',2),
            ('Jerry','12345',3);

CREATE TABLE Reports --report entity has many special properties
(
    repID int(50) NOT NULL auto_increment primary key, --report ID is a bit longer because of potential number of instances
    description text, --the stray dog description here, it can be optional so I didn't put NOT NULL constraint here
    picture blob, --the optional picture of the dog, note that it is stored in "blob" data type(basically binary file to be translated into picture)
    tranDate date NOT NULL --date to record time of the report
);

INSERT INTO Reports(description,tranDate) 
	VALUES ("a german shepherd", DATE '2018-10-01'); --date can be inserted in other formats

CREATE TABLE ReportLinkage --because one user can report to multiple shelters at a time, it is better to store the spotter->report->shelter connection in a seprate table
(
	repID int(50) NOT NULL, --associate all ID from the three entities
	spoID int(20) NOT NULL, 
    sheID int(20) NOT NULL,
    FOREIGN KEY (repID)  REFERENCES Reports(repID),
    FOREIGN KEY (spoID)  REFERENCES Spoters(spoID),
    FOREIGN KEY (sheID)  REFERENCES Shelters(sheID)
);

INSERT INTO ReportLinkage(repID,spoID,sheID) 
    VALUES (1,1,1), --the following two lines mean that report 1 was sent by spoter 1 and sent to shelters 1&2
            (1,1,2); 