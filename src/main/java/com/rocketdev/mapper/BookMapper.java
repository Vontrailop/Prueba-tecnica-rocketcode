package com.rocketdev.mapper;

import com.rocketdev.model.Book;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface BookMapper {
    List<Book> getAllBooks();
    
    Book getBookById(Long id);
    
    List<Book> searchBooks(@Param("searchTerm") String searchTerm);
    
    int insertBook(Book book);
    
    int updateBook(Book book);
    
    int updateBookQuantity(@Param("id") Long id, @Param("quantity") Integer quantity);
    
    int updateBookStatus(@Param("id") Long id, @Param("status") String status);
    
    int deleteBook(Long id);
}