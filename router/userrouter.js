import express from 'express'
import { DataAdd, DataGet, DataLogin, DataSearch, Datadelete, Dataupdate, display } from '../controller/usercontroller.js';
const router = express.Router();
import connection from "../connect/dbconnect.js";


router.get("/", (req, resp) => {
    resp.render('index')
})

router.get("/loginpage",(req,resp)=>{
    resp.render("login");
})

router.post('/add', async (req, resp) => {
    try {
        await DataAdd(req, resp)
    } catch (error) {
        console.error(error);
        resp.status(500).json({ error: 'Error' })
    }
});

router.post('/login',async(req,resp)=>{
    try {
        await DataLogin(req,resp)
    } catch (error) {
        console.error(error);
        resp.status(500).json({error:'Error'})        
    }
})

router.get('/display',async(req,resp)=>{
    try {
        await display(req,resp)
    } catch (error) {
        console.error(error);
        resp.status(500).json({error:'Error'})
    }
})

router.get('/get', async (req, resp) => {
    try {
        await DataGet(req, resp) 
    } catch (error) {
        console.error(error);
        resp.status(500).json({ error: 'Error' })
    }
})

router.get('/search/:id', async (req, resp) => {
    try {
        await DataSearch(req, resp)
    } catch (error) {
        console.error(error);
        resp.status(500).json({ error: 'Error' })
    }
});

router.get('/update', (req, resp) => {
    try {
        Dataupdate(req, resp)
    } catch (error) {
        console.error(error);
        resp.status(500).json({ error: 'Error' })
    }
})

router.post('/update', (req, res) => {
    const { id, Name, Email } = req.body;
  
    const sql = 'UPDATE users SET Name = ?, Email = ? WHERE id = ?';
    const values = [Name, Email, id];
  
    connection.query(sql, values, (err, result) => {
      if (err) {
        console.error('Database query error:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }
      res.redirect(302, 'display');
    });
});


router.get('/delete', async (req, resp) => {
    try {
        await Datadelete(req, resp)
    } catch (error) {
        console.error(error);
        resp.status(500).json({ error: 'Error' })
    }
})

export default router
