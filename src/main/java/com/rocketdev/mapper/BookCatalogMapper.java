package com.rocketdev.mapper;

import com.rocketdev.model.BookCatalog;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface BookCatalogMapper {
    List<BookCatalog> getAllGenres();
    
    BookCatalog getGenreById(Long id);
    
    List<BookCatalog> searchGenres(@Param("searchTerm") String searchTerm);
    
    int insertGenre(BookCatalog bookCatalog);
    
    int updateGenre(BookCatalog bookCatalog);
    
    int updateGenreStatus(@Param("id") Long id, @Param("status") String status);
    
    int deleteGenre(Long id);
}