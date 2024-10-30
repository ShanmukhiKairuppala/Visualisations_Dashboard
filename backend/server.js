const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const app = express();


app.use(cors());
app.use(bodyParser.json()); 

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((error) => console.error('Error connecting to MongoDB:', error));

const DataSchema = new mongoose.Schema({}, { strict: false });
const DataModel = mongoose.model('Data', DataSchema);

const StudentSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
});

const StudentModel = mongoose.model('Student', StudentSchema);

app.post('/api/students', async (req, res) => {
  try {
    console.log(req.body);
    const { firstName, lastName, email } = req.body;

    // Create a new student
    const newStudent = new StudentModel({ firstName, lastName, email });
    await newStudent.save();

    res.status(201).json({ message: "Student added successfully." });
  } catch (error) {
    console.error("Error adding student:", error);
    res.status(500).json({ message: "Error adding student." });
  }
});


app.get('/api/students', async (req, res) => {
  try {
    const students = await StudentModel.find();
    res.status(200).json(students);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ message: 'Error fetching students' });
  }
});

app.post('/api/upload-excel', async (req, res) => {
  try {
    const data = req.body.data;

    if (!data || !Array.isArray(data)) {
      return res.status(400).json({ message: "Invalid data format." });
    }

    // Save the data to MongoDB
    await DataModel.insertMany(data);

    res.status(200).json({ message: "Data uploaded successfully." });
  } catch (error) {
    console.error("Error uploading data:", error);
    res.status(500).json({ message: "Error uploading data." });
  }
});

app.get('/api/get-data', async (req, res) => {
  try {
    const data = await DataModel.find(); 
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ message: 'Error fetching data' });
  }
});



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
