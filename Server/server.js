const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const jwt = require('jsonwebtoken');
require('dotenv').config()
const app = express();
const bcrypt = require('bcrypt');
const saltRounds = 10;

app.use(express.json()); 
const corsOptions = {
    origin: process.env.DATABASEIP,
    optionsSuccessStatus: 200,
};
  
app.use(cors(corsOptions));
  

const connection = mysql.createConnection({
    host: process.env.DATABASEHOST,
    user: process.env.DATABASEUSER,
    password: process.env.DATABASEPASSWORD
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("Connected to the database!");
});

connection.query("USE TriathlonTraining;", function (err, result) {
    if (err) throw err;
});

function verifyToken(req, res, next) {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }
  
    try {
      const decoded = jwt.verify(token, process.env.USERSECRETKEY);

      req.user = decoded;
      next();
    } catch (err) {
      res.status(401).json({ message: 'Token is invalid' });
    }
}

app.post('/login', (req, res) => {
    // Get Post Values
    const username = req.body["username"].toLowerCase();
    const password = req.body["password"];

    // Check if user is in data base
    const query = mysql.format("SELECT Password FROM Users WHERE UserName = ?;", [username]);
    connection.query(query, function (err, result, fields) {
        if(result.length === 0) {
            return res.status(200).json({ message: 'Authentication failed, login failure' });
        }
        // Check if password is correct
        compareHash(password, result[0].Password).then((result) => {
            if(!result){
                return res.status(200).json({ message: 'Authentication failed, login failure' });
            } else {
                const token = jwt.sign({ username: username }, process.env.USERSECRETKEY, { expiresIn: '24h' });
                res.json({ token });

            }
        });
    });
});

app.post('/signup', (req, res) => {
    // Get Post Values
    const username = req.body["username"].toLowerCase();
    const password = req.body["password"];

    // Check if user is in data base
    try {
        // Check if user exists
        checkIfUserExists(username).then((result) => {
            if(result){
                return res.status(200).json({ message: 'User already exists' });
            } else {
                createUser(username, password).then((result) => {
                    const token = jwt.sign({ username: username }, process.env.USERSECRETKEY, { expiresIn: '24h' });
                    return res.status(200).json({ token });
                })
                .catch((error) => {
                    console.log(error);
                    return res.status(500).json({ message: 'Error creating user', error: error });
                });
            }
        })
        .catch((error) => {
            console.log(error);
            return res.status(500).json({ message: 'Error creating user', error: error });
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Error creating user', error: error });
    }
});



app.post('/GetEvent', verifyToken, async (req, res) => {
    try {
        let ID = await getIdFromUsername(req.user.username);
        let listData = await GetListData(ID);
        return res.status(200).json({ data: listData });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Error getting list', error: error });
    }

});

app.post('/CreateEvent', verifyToken, async (req, res) => {
    const Date = req.body["Date"];
    const Activity = req.body["Activity"];
    const Intensity = req.body["Intensity"];
    const Length = req.body["Length"];
    const StartTime = req.body["StartTime"];
    let ID;
    if(Date === "" || Activity === "" || Intensity === "" || Length === "" || StartTime === "" || ID === ""){
        return res.status(400).json({ message: 'Bad Request, missing parameters' });
    }
    
    try {
        console.log("Username: ", req.user.username)
        ID = await getIdFromUsername(req.user.username);
        console.log("ID: ", ID)
        let listId = await CreateEvent(Date, Activity, Intensity, Length, StartTime, ID);
        return res.status(200).json({ message: 'Event Created', id: listId });
    } catch (error) {
        console.error("error: ", error);
        return res.status(500).json({ message: 'Error creating Event', error: error });
    }
});

app.post('/RemoveEvent', verifyToken, async (req, res) => {
    // Consider what could happen if some idiot sends a request from a different user
    const eventId = req.body["EventID"];
    if(eventId === ""){
        return res.status(400).json({ message: 'Bad Request, missing event id' });
    }
    
    try {
        await RemoveList(eventId);
        return res.status(200).json({ message: 'List Removed' });
    } catch (error) {
        console.error("error: ", error);
        return res.status(500).json({ message: 'Error removing event', error: error });
    }
});

function createUser(username, password){
    return new Promise((resolve, reject) => {
        GenerateHash(password).then((hash) => {
            const query = mysql.format("INSERT INTO Users (UserName, Password) VALUES (?, ?);", [username, hash]);
            connection.query(query, function (err, result, fields) {
                if (err) reject(err);
                resolve(result.insertId);
            });
        });
    });
};

function checkIfUserExists(username){
    return new Promise((resolve, reject) => {
        const query = mysql.format("SELECT * FROM Users WHERE UserName = ?;", [username]);
        connection.query(query, function (err, result, fields) {
            if (err) reject(err);
            resolve(result.length > 0);
        });
    });
}

function RemoveList(id) {
    return new Promise ((resolve, reject) => {
        
        removeEventQuery = mysql.format("DELETE FROM `Event` WHERE EventID = ?;", [id]);
        connection.query(removeEventQuery, function (err, result, fields) {
            if (err) reject(err);
            resolve(result);
        }); 
    });
}

function CreateList(name, description, id) {
    return new Promise ((resolve, reject) => {
    let query = mysql.format("INSERT INTO `Shopping List` (`Name`, `Description`, `Owner_ID`) VALUES (?, ?, ?);", [name, description, id]);
        connection.query(query, function (err, result, fields) {
            if (err) reject(err);
            resolve(result.insertId);
        }); 
    });
}

function CreateEvent(Date, Activity, Intensity, Length, StartTime, ID) {
    return new Promise ((resolve, reject) => {
    let query = mysql.format("INSERT INTO `Event` (`Date`, `ActivityType`, `Intensity`, `Length`, `StartTime`, `UserID`) VALUES (?, ?, ?, ?, ?, ?);", [Date, Activity, Intensity, Length, StartTime, ID]);
        connection.query(query, function (err, result, fields) {
            if (err) {
                console.error('Error in createUser query:', err);
                reject(err);
            } else {
                console.log('Result of createUser query:', result);
                resolve(result && result.insertId);
            }
        });
    });
}

function GetListData(UserID) {
    return new Promise ((resolve, reject) => {
        let query = mysql.format("SELECT * FROM `Event` WHERE `UserID` = ?", [UserID]);
        connection.query(query, function (err, result) {
            if (err) reject(err);
            resolve(result);
        });
    });
}

function getIdFromUsername(username){
    return new Promise((resolve, reject) => {
    
        let query = mysql.format("SELECT ID FROM Users WHERE UserName = ?;", [username]);
        connection.query(query, function (err, result, fields) {
            if (err) reject(err);
            resolve(result[0].ID);
        });
    });
}

function GenerateHash(password) {
    return new Promise((resolve, reject) => {
        bcrypt.hash(password, saltRounds, function(err, hash) {
            if (err) reject(err);
            resolve(hash);
        });
    });
}

function compareHash(password, hash) {
    return new Promise((resolve, reject) => {
        bcrypt.compare(password, hash, function(err, result) {
            if (err) reject(err);
            resolve(result);
        });
    });
}


app.listen(5000, () => console.log('Server running on port 5000'));