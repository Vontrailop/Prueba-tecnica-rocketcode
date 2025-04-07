package com.rocketdev.mapper;

import com.rocketdev.model.Category;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface CategoryMapper {
    List<Category> getAllCategories();
    
    Category getCategoryById(Long id);
    
    Category getCategoryByName(String genreName);
    
    int insertCategory(Category category);
    
    int updateCategory(Category category);
    
    int deleteCategory(Long id);
}