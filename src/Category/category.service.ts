import { Injectable } from '@nestjs/common';
import { CategoryInterface } from './Model/category.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CategoryDto } from './DTO/category.dto';
import { queryDto } from './DTO/query.dto';

@Injectable()
export class CategoriesService {
    constructor(
        @InjectModel("categories")
        private CategorysModel : Model<CategoryInterface> ,
    ){}
    async createCategory(CategoryData : CategoryDto){
      const {category,subCategory}=CategoryData
        try{
        
          const existingCategory = await this.CategorysModel.findOne({ category });

          if (existingCategory) {
              // Add subcategory if it doesn't already exist
              if (!existingCategory.subcategories.includes(subCategory)) {
                  existingCategory.subcategories.push(subCategory);
                  await existingCategory.save();
              }
              return existingCategory;
          } else {
              // Create new category with subcategory
              const newCategory = new this.CategorysModel({
                category,
                  subcategories: [subCategory],
              });
              return await newCategory.save();
          }
      
        }catch(error){
            return error
        }

    }

    async getAllCategories() {
      const video =await this.CategorysModel.find()
      
      return video;
    }
  
      async deleteCategory(id:string) {
        const Category = await this.CategorysModel.deleteOne({_id:id});
        return Category;
      }

    
      

}
