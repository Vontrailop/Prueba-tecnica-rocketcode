package com.rocketdev.mapper;

import com.rocketdev.model.Student;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface StudentMapper {
    List<Student> getAllStudents();
    
    Student getStudentById(Long id);
    
    Student getStudentByStudentNumber(String studentNumber);
    
    List<Student> searchStudents(@Param("searchTerm") String searchTerm);
    
    int insertStudent(Student student);
    
    int updateStudent(Student student);
    
    int deleteStudent(Long id);
}