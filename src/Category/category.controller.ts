import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseFilters, ValidationPipe } from '@nestjs/common';
import { CategoriesService } from './category.service';
import { CategoryDto } from './DTO/category.dto';
import { queryDto } from './DTO/query.dto';

@Controller('category')
export class CategoriesController {
    constructor(
        private categoryservice : CategoriesService
    ){}
    @Post()
    async createCategories(@Body() categoryData: CategoryDto ){
        return await this.categoryservice.createCategory(categoryData)
    }
  

    @Delete('/:id')
    async deleteCategories( @Param('id') categoryId){
        return await this.categoryservice.deleteCategory(categoryId)
    }
    @Get()
    async getAllCategories() {
        return await this.categoryservice.getAllCategories();
    
  }
}
