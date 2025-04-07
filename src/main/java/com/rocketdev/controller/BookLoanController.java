package com.rocketdev.controller;

import com.rocketdev.model.BookLoan;
import com.rocketdev.service.BookLoanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/loans")
@CrossOrigin(origins = "*")
public class BookLoanController {
    @Autowired
    private BookLoanService bookLoanService;

    @GetMapping
    public ResponseEntity<List<BookLoan>> getAllLoans() {
        return ResponseEntity.ok(bookLoanService.getAllLoans());
    }

    @GetMapping("/{id}")
    public ResponseEntity<BookLoan> getLoanById(@PathVariable Long id) {
        BookLoan loan = bookLoanService.getLoanById(id);
        return loan != null ? ResponseEntity.ok(loan) : ResponseEntity.notFound().build();
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<BookLoan>> getLoansByStudentId(@PathVariable Long studentId) {
        return ResponseEntity.ok(bookLoanService.getLoansByStudentId(studentId));
    }

    @GetMapping("/book/{bookId}")
    public ResponseEntity<List<BookLoan>> getLoansByBookId(@PathVariable Long bookId) {
        return ResponseEntity.ok(bookLoanService.getLoansByBookId(bookId));
    }

    @GetMapping("/overdue")
    public ResponseEntity<List<BookLoan>> getOverdueLoans() {
        return ResponseEntity.ok(bookLoanService.getOverdueLoans());
    }

    @PostMapping
    public ResponseEntity<BookLoan> createLoan(@RequestBody BookLoan bookLoan) {
        try {
            return new ResponseEntity<>(bookLoanService.createLoan(bookLoan), HttpStatus.CREATED);
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/{id}/return")
    public ResponseEntity<BookLoan> processReturn(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(bookLoanService.processReturn(id));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<BookLoan> updateLoan(@PathVariable Long id, @RequestBody BookLoan bookLoan) {
        try {
            bookLoan.setId(id);
            return ResponseEntity.ok(bookLoanService.updateLoan(bookLoan));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Void> updateLoanStatus(@PathVariable Long id, @RequestParam String status) {
        try {
            bookLoanService.updateLoanStatus(id, status);
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLoan(@PathVariable Long id) {
        try {
            bookLoanService.deleteLoan(id);
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().build();
        }
    }
}