import express from 'express'
import {readFile, writeFile, mkdir} from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
const app = express()
const PORT = 3000

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const DATA_DIRECTORY = path.join(__dirname, 'data')
const DATA_FILE = path.join(DATA_DIRECTORY, students.json)

// Load and save helper functions
async function ensureDataFile(){
    try{
        await mkdir(DATA_DIRECTORY, {recursive:true})
        // If the file doesn't exist, then it creates it with []
        await readFile(DATA_FILE, '[]', 'utf8')
    }catch(err){
        await writeFile(DATA_FILE, "[]", 'utf8')
    }
}

// Set EJS as the template engine for the project
app.set('view engine', 'ejs')

// Public Static folder
app.use(express.static('public'))

// Student data
const students = 

// Routes for users
app.get('/', (req, res) =>{
    res.render('index', {title: "Welcome to the Student Dashboard!"})
    // Since we are using a template engine like EJS, the function render is now possible to use, allowing the templating engine to directly reference any file in the views folder index => index.ejs
    // The object with tutle and the string are being passed directly into the template, consider it like adding parameters to a function but here, there the index.ejs will be created using that data
})

app.get('/students', (req, res) =>{
    res.render('students', {title: "Our students", students})
})

app.listen(PORT, () =>{
    console.log(`Server running on http://localhost:${PORT}`)
})