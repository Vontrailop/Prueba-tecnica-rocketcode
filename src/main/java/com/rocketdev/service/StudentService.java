package com.rocketdev.service;

import com.rocketdev.mapper.StudentMapper;
import com.rocketdev.model.Student;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class StudentService {
    @Autowired
    private StudentMapper studentMapper;

    public List<Student> getAllStudents() {
        return studentMapper.getAllStudents();
    }

    public Student getStudentById(Long id) {
        return studentMapper.getStudentById(id);
    }

    public Student getStudentByStudentNumber(String studentNumber) {
        return studentMapper.getStudentByStudentNumber(studentNumber);
    }

    public List<Student> searchStudents(String searchTerm) {
        return studentMapper.searchStudents("%" + searchTerm + "%");
    }

    @Transactional
    public Student createStudent(Student student) {
        studentMapper.insertStudent(student);
        return student;
    }

    @Transactional
    public Student updateStudent(Student student) {
        Student existingStudent = studentMapper.getStudentById(student.getId());
        if (existingStudent != null) {
            studentMapper.updateStudent(student);
            return student;
        }
        return null;
    }

    @Transactional
    public boolean deleteStudent(Long id) {
        Student existingStudent = studentMapper.getStudentById(id);
        if (existingStudent != null) {
            studentMapper.deleteStudent(id);
            return true;
        }
        return false;
    }
}