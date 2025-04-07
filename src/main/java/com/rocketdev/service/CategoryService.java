package com.rocketdev.service;

import com.rocketdev.mapper.CategoryMapper;
import com.rocketdev.model.Category;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryService {
    
    @Autowired
    private CategoryMapper categoryMapper;
    
    public List<Category> getAllCategories() {
        return categoryMapper.getAllCategories();
    }
    
    public Category getCategoryById(Long id) {
        return categoryMapper.getCategoryById(id);
    }
    
    public Category getCategoryByName(String genreName) {
        return categoryMapper.getCategoryByName(genreName);
    }
    
    public Category createCategory(Category category) {
        if (category.getStatus() == null) {
            category.setStatus("ACTIVE");
        }
        categoryMapper.insertCategory(category);
        return category;
    }
    
    public Category updateCategory(Category category) {
        categoryMapper.updateCategory(category);
        return category;
    }
    
    public boolean deleteCategory(Long id) {
        return categoryMapper.deleteCategory(id) > 0;
    }
}