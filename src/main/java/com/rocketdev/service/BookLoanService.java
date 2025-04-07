package com.rocketdev.service;

import com.rocketdev.mapper.BookLoanMapper;
import com.rocketdev.model.BookLoan;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Calendar;
import java.util.Date;
import java.util.List;

@Service
public class BookLoanService {
    @Autowired
    private BookLoanMapper bookLoanMapper;

    @Autowired
    private BookService bookService;

    public List<BookLoan> getAllLoans() {
        return bookLoanMapper.getAllLoans();
    }

    public BookLoan getLoanById(Long id) {
        return bookLoanMapper.getLoanById(id);
    }

    public List<BookLoan> getLoansByStudentId(Long studentId) {
        return bookLoanMapper.getLoansByStudentId(studentId);
    }

    public List<BookLoan> getLoansByBookId(Long bookId) {
        return bookLoanMapper.getLoansByBookId(bookId);
    }

    public List<BookLoan> getOverdueLoans() {
        return bookLoanMapper.getOverdueLoans();
    }

    @Transactional
    public BookLoan createLoan(BookLoan bookLoan) {
        // Check if book is available
        if (!bookService.isBookAvailable(bookLoan.getBookId())) {
            throw new IllegalStateException("Book is not available for loan");
        }

        // Set loan details
        bookLoan.setLoanDate(new Date());
        
        // Set due date (default to 14 days from loan date)
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(bookLoan.getLoanDate());
        calendar.add(Calendar.DAY_OF_MONTH, 14);
        bookLoan.setDueDate(calendar.getTime());
        
        bookLoan.setStatus("ACTIVE");

        // Create the loan
        bookLoanMapper.createLoan(bookLoan);

        // Update book status
        bookService.updateBookStatus(bookLoan.getBookId(), "LOANED");

        return bookLoan;
    }

    @Transactional
    public BookLoan processReturn(Long loanId) {
        BookLoan loan = bookLoanMapper.getLoanById(loanId);
        if (loan == null) {
            throw new IllegalArgumentException("Loan not found");
        }

        if ("RETURNED".equals(loan.getStatus())) {
            throw new IllegalStateException("Book has already been returned");
        }

        // Process return
        Date returnDate = new Date();
        bookLoanMapper.updateReturnDate(loanId, returnDate);

        // Update book status
        bookService.updateBookStatus(loan.getBookId(), "AVAILABLE");

        // Refresh loan data
        return bookLoanMapper.getLoanById(loanId);
    }

    @Transactional
    public BookLoan updateLoan(BookLoan bookLoan) {
        BookLoan existingLoan = bookLoanMapper.getLoanById(bookLoan.getId());
        if (existingLoan == null) {
            throw new IllegalArgumentException("Loan not found");
        }

        bookLoanMapper.updateLoan(bookLoan);
        return bookLoanMapper.getLoanById(bookLoan.getId());
    }

    @Transactional
    public void updateLoanStatus(Long loanId, String status) {
        BookLoan existingLoan = bookLoanMapper.getLoanById(loanId);
        if (existingLoan == null) {
            throw new IllegalArgumentException("Loan not found");
        }

        bookLoanMapper.updateLoanStatus(loanId, status);
    }

    @Transactional
    public void deleteLoan(Long id) {
        BookLoan existingLoan = bookLoanMapper.getLoanById(id);
        if (existingLoan == null) {
            throw new IllegalArgumentException("Loan not found");
        }

        if ("ACTIVE".equals(existingLoan.getStatus())) {
            throw new IllegalStateException("Cannot delete an active loan");
        }

        bookLoanMapper.deleteLoan(id);
    }
}