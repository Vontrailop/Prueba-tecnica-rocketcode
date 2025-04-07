package com.rocketdev.mapper;

import com.rocketdev.model.BookLoan;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Date;

@Mapper
public interface BookLoanMapper {
    List<BookLoan> getAllLoans();
    
    BookLoan getLoanById(Long id);
    
    List<BookLoan> getLoansByStudentId(Long studentId);
    
    List<BookLoan> getLoansByBookId(Long bookId);
    
    List<BookLoan> getOverdueLoans();
    
    int createLoan(BookLoan bookLoan);
    
    int updateLoan(BookLoan bookLoan);
    
    int updateLoanStatus(@Param("id") Long id, @Param("status") String status);
    
    int updateReturnDate(@Param("id") Long id, @Param("returnDate") Date returnDate);
    
    int deleteLoan(Long id);
}