package com.rocketdev.controller;

import com.rocketdev.model.BookCatalog;
import com.rocketdev.service.BookCatalogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/catalogs")
@CrossOrigin(origins = "*")
public class BookCatalogController {
    @Autowired
    private BookCatalogService bookCatalogService;

    @GetMapping
    public ResponseEntity<List<BookCatalog>> getAllGenres() {
        return ResponseEntity.ok(bookCatalogService.getAllGenres());
    }

    @GetMapping("/{id}")
    public ResponseEntity<BookCatalog> getGenreById(@PathVariable Long id) {
        BookCatalog genre = bookCatalogService.getGenreById(id);
        return genre != null ? ResponseEntity.ok(genre) : ResponseEntity.notFound().build();
    }

    @GetMapping("/search")
    public ResponseEntity<List<BookCatalog>> searchGenres(@RequestParam String term) {
        return ResponseEntity.ok(bookCatalogService.searchGenres(term));
    }

    @PostMapping
    public ResponseEntity<BookCatalog> createGenre(@RequestBody BookCatalog bookCatalog) {
        return new ResponseEntity<>(bookCatalogService.addGenre(bookCatalog), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<BookCatalog> updateGenre(@PathVariable Long id, @RequestBody BookCatalog bookCatalog) {
        bookCatalog.setId(id);
        BookCatalog updatedGenre = bookCatalogService.updateGenre(bookCatalog);
        return updatedGenre != null ? ResponseEntity.ok(updatedGenre) : ResponseEntity.notFound().build();
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Void> updateGenreStatus(@PathVariable Long id, @RequestParam String status) {
        boolean updated = bookCatalogService.updateGenreStatus(id, status);
        return updated ? ResponseEntity.ok().build() : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGenre(@PathVariable Long id) {
        boolean deleted = bookCatalogService.deleteGenre(id);
        return deleted ? ResponseEntity.ok().build() : ResponseEntity.notFound().build();
    }
}