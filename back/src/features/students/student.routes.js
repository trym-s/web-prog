const express = require('express');
const router = express.Router();
const studentController = require('./student.controller.js');

//  GET /api/students
router.get('/', studentController.getAllStudents);

//  POST /api/students
router.post('/', studentController.createStudent);


// TODO: Define other routes later
//  GET /api/students/:id
//  PUT /api/students/:id
//  DELETE /api/students/:id

module.exports = router;
