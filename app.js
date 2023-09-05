import express from 'express'
import dotenv from 'dotenv'
import path from 'path'
import hbs from 'hbs'
import connection from './connect/dbconnect.js'
import { fileURLToPath } from "url";
import bodyParser from 'body-parser'
const app = express();
dotenv.config();
const PORT = process.env.PORT;
const hostname = process.env.host
app.use(express.urlencoded({ extended: true }));

app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const viewPath=path.join(__dirname,"./views");
app.set('view engine','hbs')
app.set("views",viewPath);

import userrouter from './router/userrouter.js'
app.use('/',userrouter);

app.listen(PORT, ()=>{
    console.log(`Server running on port http://${hostname}:${PORT}`);
})
