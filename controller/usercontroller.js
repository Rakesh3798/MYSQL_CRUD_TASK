import connection from "../connect/dbconnect.js";
import bcrypt from 'bcryptjs'

//Postman Register API
// export const DataAdd = (req, resp) => {
//     const { Name, Email, password } = req.body;
//     const checkQuery = "SELECT * FROM users WHERE Name = ? OR Email = ?";
//     const checkValues = [Name, Email];

//     connection.query(checkQuery, checkValues, (checkErr, checkResult) => {

//         if (checkResult.length > 0) {
//             return resp.status(400).json({ error: 'User with the same name or email already exists' });
//         }
//         const data = { Name, Email, password };
//         const insertQuery = "INSERT INTO users SET ?";
        
//         connection.query(insertQuery, data, (insertErr, insertResult) => {
//             if (insertErr) {
//                 console.error('Database query error:', insertErr);
//                 return resp.status(500).json({ error: 'Internal server error' });
//             }
//             resp.send(JSON.stringify({ status: 200, err: null, response: "New data added successfully" }));
//         });
//     });
// };

export const DataAdd = async(req, resp) => {
    const { Name, Email, password } = req.body;
    if (!Name || !Email || !password) {
        return resp.status(400).json({ error: 'Name, Email, and Password are required fields' });
    }
    const hashpassword = await bcrypt.hash(password,10)
    let data = { Name,Email,password: hashpassword};
    let sql = "INSERT INTO users SET ?";
    let query = connection.query(sql, data, (err, result) => {
        if (err) {
            console.error(err);
            if (err.code === 'ER_DUP_ENTRY') {
                return resp.status(400).json({ error: 'Name or Email already exists' });
            }
            return resp.status(500).json({ error: 'Error while registering' });
        }
        resp.render("index", { "msg": "Register successfully" });
    });
}

export const DataLogin = async (req, resp) => {
    const { Email, password } = req.body;
    //console.log(Email,password);
    let sql = "SELECT * FROM users WHERE Email = ?";
    let query = connection.query(sql, [Email], async (err, result) => {
        if (err) {
            console.err('Database query error:', err)
            return resp.status(500).json({ error: 'Internal server error' })
        }
        if (result.length === 0) {
            return resp.status(401).json({ error: 'Invalid credentials' });
        }
        const user = result[0];
        //console.log(user);   
        const isPasswordValid = await bcrypt.compare(password, user.password);
        // console.log(isPasswordValid);
        if (isPasswordValid) {                                                                                                                                                                                                                                                                                                                                                                                             
            resp.redirect("display");
            //return resp.status(200).json({ message: 'Login successful', user: user });
        } else {
            return resp.status(401).json({ error: 'Invalid credentials' });
        }
    })
}

export const display= (req, res) => {
    const sql = 'SELECT * FROM users';

    connection.query(sql, (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        res.render('display', { data: results });
    });
};

//Postman Get API
export const DataGet = (req, resp) => {
    let sql = "SELECT * FROM users";
    let query = connection.query(sql, (err, result) => {
        if (err) throw err;
        resp.send(JSON.stringify({ Status: 200, err: null, response: result }))
    })
}

//Postman Search API
export const DataSearch = (req, resp) => {
    let sql = "SELECT * FROM users WHERE id = " + req.params.id;
    let query = connection.query(sql, (err, result) => {
        if (err) throw err;
        resp.send(JSON.stringify({ Status: 200, err: null, response: result }))
    })
}

//Postman update API
// export const Dataupdate = (req, resp) => {
//     let sql = "UPDATE users SET Name='" + req.body.Name + "', Email='" + req.body.Email + "' WHERE id=" + req.body.id;
//     let query = connection.query(sql, (err, result) => {
//         if (err) throw err;
//         resp.send(JSON.stringify({ Status: 200, err: null, response: "Data update successfully" }))
//     })
// }

export const Dataupdate =  (req, res) => {
    const userId = req.query.uid;
    connection.query('SELECT * FROM users WHERE id = ?', userId, (err, results) => {
      if (err) {
        console.error('Database query error:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }
  
      if (results.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.render('update', { data: results[0] });
    });
  };
  
  
//postman delete API
// export const Datadelete = (req, resp) => {
//     let sql = "DELETE FROM users WHERE id = " + req.params.id;
//     let query = connection.query(sql, (err, result) => {
//         if (err) throw err;
//         resp.send(JSON.stringify({ Status: 200, err: null, response: "Data delete successfully" }))
//     })
// }

export const Datadelete = (req, resp) => {
    const userId = req.query.did;
    if (isNaN(userId)) {
        return resp.status(400).json({ error: 'Invalid user ID' });
    }
    const sql = "DELETE FROM users WHERE id = ?";
    const values = [userId];
    connection.query(sql, values, (err, result) => {
        if (err) {
            console.error('Database query error:', err);
            return resp.status(500).json({ error: 'Internal server error' });
        }
        resp.redirect("display");
    });
};
