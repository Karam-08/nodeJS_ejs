import express from 'express'
import {readFile, writeFile, mkdir} from 'fs/promises'
import path, { parse } from 'path'
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

async function loadStudents(){
    await ensureDataFile()
    const rawData = await readFile(DATA_FILE, 'utf8')
    return JSON.parse(rawData)
}

async function saveStudents(students){
    await writeFile(DATA_FILE, JSON.stringify(students, null, 2), 'utf8')
}

// Set EJS as the template engine for the project
app.set('view engine', 'ejs')

// Public Static folder
app.use(express.static('public'))

// Parse form body info: application/x-www-form-urlencoded
app.use(express.urlencoded({extended: false}))

// Routes for users
app.get('/', (req, res) =>{
    res.render('index', {title: "Welcome to the Student Dashboard!"})
    // Since we are using a template engine like EJS, the function render is now possible to use, allowing the templating engine to directly reference any file in the views folder index => index.ejs
    // The object with tutle and the string are being passed directly into the template, consider it like adding parameters to a function but here, there the index.ejs will be created using that data
})

app.get('/students', async (req, res) =>{
    const students = await loadStudents()
    res.render('students', {
        title: "Our students", 
        students, 
        errors: null, 
        form: {name: "", age: "", grade: ""},
        flash: req.query.flash || null
    })
})

app.post('/students', async (req, res) =>{
    const {name, grade, age} = req.body

    // data validation
    const errors = []

    if(!name.trim()){errors.push("Name is required.")}
    if(!grade.trim()){errors.push("Grade is required.")}
    const parseAge = Number(age)
    if(!Number.isFinite(parseAge) || parseAge < 5 || parseAge > 120){
        errors.push("Age must be a valid number between 5 and 120")
    }

    // error check
    if(errors.length){
        const students = await loadStudents()
        return res.status(400).render('students', {
            title: "Our Students",
            students,
            errors,
            form: {name, grade, age},
            flash: null
        })
    }

    // Save to json
    const students = await loadStudents()
    students.push({name: name.trim(), grade: grade.trim(), age: parseAge})
    await saveStudents(students)

    // PRG(Post/Redirect/Get) with a simple flash
    res.redirect('/students?flash=Student%20Added%20Successfully')

})

app.listen(PORT, () =>{
    console.log(`Server running on http://localhost:${PORT}`)
})