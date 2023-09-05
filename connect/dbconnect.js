import mysql from 'mysql2'

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Tankr556@',
    database:'CRUD1',
    port: 3307,
})  

connection.connect(function(err) {
    if (err) {
        console.log(err);
    } else
    
     console.log("Mysql Connected!");
});

export default connection