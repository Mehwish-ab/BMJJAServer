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
    async createCategories(@Body(ValidationPipe) categoryData: CategoryDto ){
        return await this.categoryservice.createCategory(categoryData)
    }
    @Patch('/:id')
    async updateCategories(@Param('id') categoryId,
    @Body() productToPost, ){
        return await this.categoryservice.updateCategory(categoryId,productToPost)
    }
    @Delete(':/id')
    async deleteCategories( @Param('id') categoryId){
        return await this.categoryservice.deleteCategory(categoryId)
    }
 
    @Get()
    async getCategories(@Query(ValidationPipe) queryParams: queryDto) {
        return await this.categoryservice.getCategories(queryParams);
    
  }
    @Post('/:id')
    async GetCategoryById(@Param('id') id ){
        return await this.categoryservice.getCategorybyId(id)
    }
}
