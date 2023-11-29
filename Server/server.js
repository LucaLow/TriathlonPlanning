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

/// TODO:
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
        // If user does not exist, create user
    } catch (error) {
        
    }
});



app.post('/GetLists', verifyToken, async (req, res) => {
    let query = mysql.format("SELECT sl.* FROM `Shopping List` AS sl INNER JOIN `Users` AS u ON sl.`Owner_ID` = u.`ID` WHERE u.`User_Name` = ?;", [req.user.username]);
    connection.query(query, function (err, result, fields) {
        if (err) {
            // Handle the error here, e.g., send a response with an error message
            console.error("error: ", err);
            return res.status(500).json({ message: 'Error fetching shopping lists', error: err });
        }
        // Assuming you want to send the result as a JSON response
        res.json(result);
    });
});

app.post('/CreateList', verifyToken, async (req, res) => {
    const name = req.body["listName"];
    const description = req.body["listDescription"];
    
    if(name === "" || description === ""){
        return res.status(400).json({ message: 'Bad Request, missing list name or description' });
    }
    
    try {
        id = await getIdFromUsername(req.user.username);
        let listId = await CreateList(name, description, id);
        return res.status(200).json({ message: 'List Created', id: listId });
    } catch (error) {
        console.error("error: ", error);
        return res.status(500).json({ message: 'Error creating list', error: error });
    }
});

/// TODO: Consider, what happens if a valid user sends a request with the list id of another user?
app.post('/RemoveList', verifyToken, async (req, res) => {
    
    const id = req.body["listID"];
    if(id === ""){
        return res.status(400).json({ message: 'Bad Request, missing list id' });
    }
    
    try {
        await RemoveList(id);
        return res.status(200).json({ message: 'List Removed' });
    } catch (error) {
        console.error("error: ", error);
        return res.status(500).json({ message: 'Error removing list', error: error });
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
        
        let removeListQuery = mysql.format("DELETE FROM `Shopping List` WHERE ID = ?;", [id]);
        let removeItemQuery = mysql.format("DELETE FROM `Shopping List Item` WHERE List_ID = ?;", [id]);
        
        connection.query(removeItemQuery, (err) => {
            if (err) reject(err);
            connection.query(removeListQuery, function (err, result, fields) {
                if (err) reject(err);
                resolve(result);
            }); 
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

function GetListData(listId) {
    return new Promise ((resolve, reject) => {
        let query = mysql.format("SELECT * FROM `Shopping List Item` WHERE `List_ID` = ?", [listId])
        connection.query(query, function (err, result) {
            if (err) reject(err);
            resolve(result);
        });
    });
}

function getIdFromUsername(username){
    return new Promise((resolve, reject) => {
    
        let query = mysql.format("SELECT ID FROM Users WHERE User_Name = ?;", [username]);
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