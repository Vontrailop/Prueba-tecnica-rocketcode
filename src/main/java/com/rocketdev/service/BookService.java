package com.rocketdev.service;

import com.rocketdev.mapper.BookMapper;
import com.rocketdev.model.Book;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class BookService {
    @Autowired
    private BookMapper bookMapper;

    public List<Book> getAllBooks() {
        return bookMapper.getAllBooks();
    }

    public Book getBookById(Long id) {
        return bookMapper.getBookById(id);
    }

    public List<Book> searchBooks(String searchTerm) {
        return bookMapper.searchBooks("%" + searchTerm + "%");
    }

    @Transactional
    public Book addBook(Book book) {
        book.setStatus("AVAILABLE");
        bookMapper.insertBook(book);
        return book;
    }

    @Transactional
    public Book updateBook(Book book) {
        bookMapper.updateBook(book);
        return book;
    }

    @Transactional
    public void updateBookQuantity(Long bookId, Integer quantity) {
        Book book = bookMapper.getBookById(bookId);
        if (book != null) {
            bookMapper.updateBookQuantity(bookId, quantity);
            if (quantity == 0) {
                bookMapper.updateBookStatus(bookId, "OUT_OF_STOCK");
            } else {
                bookMapper.updateBookStatus(bookId, "AVAILABLE");
            }
        }
    }

    @Transactional
    public void updateBookStatus(Long bookId, String status) {
        Book book = bookMapper.getBookById(bookId);
        if (book != null) {
            bookMapper.updateBookStatus(bookId, status);
        }
    }

    @Transactional
    public void deleteBook(Long id) {
        bookMapper.deleteBook(id);
    }

    public boolean isBookAvailable(Long bookId) {
        Book book = bookMapper.getBookById(bookId);
        return book != null && book.getQuantity() > 0 && "AVAILABLE".equals(book.getStatus());
    }
}