package com.rocketdev.service;

import com.rocketdev.mapper.BookCatalogMapper;
import com.rocketdev.model.BookCatalog;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class BookCatalogService {
    @Autowired
    private BookCatalogMapper bookCatalogMapper;

    public List<BookCatalog> getAllGenres() {
        return bookCatalogMapper.getAllGenres();
    }

    public BookCatalog getGenreById(Long id) {
        return bookCatalogMapper.getGenreById(id);
    }

    public List<BookCatalog> searchGenres(String searchTerm) {
        return bookCatalogMapper.searchGenres("%" + searchTerm + "%");
    }

    @Transactional
    public BookCatalog addGenre(BookCatalog bookCatalog) {
        bookCatalog.setStatus("ACTIVE");
        bookCatalogMapper.insertGenre(bookCatalog);
        return bookCatalog;
    }

    @Transactional
    public BookCatalog updateGenre(BookCatalog bookCatalog) {
        BookCatalog existingGenre = bookCatalogMapper.getGenreById(bookCatalog.getId());
        if (existingGenre != null) {
            bookCatalogMapper.updateGenre(bookCatalog);
            return bookCatalog;
        }
        return null;
    }

    @Transactional
    public boolean updateGenreStatus(Long genreId, String status) {
        BookCatalog existingGenre = bookCatalogMapper.getGenreById(genreId);
        if (existingGenre != null) {
            bookCatalogMapper.updateGenreStatus(genreId, status);
            return true;
        }
        return false;
    }

    @Transactional
    public boolean deleteGenre(Long id) {
        BookCatalog existingGenre = bookCatalogMapper.getGenreById(id);
        if (existingGenre != null) {
            bookCatalogMapper.deleteGenre(id);
            return true;
        }
        return false;
    }
}