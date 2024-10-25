import { Injectable } from '@nestjs/common';
import { categoryInterface } from './Model/category.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CategoryDto } from './DTO/category.dto';
import { queryDto } from './DTO/query.dto';

@Injectable()
export class CategoriesService {
    constructor(
        @InjectModel("categories")
        private CategorysModel : Model<categoryInterface> ,
    ){}
    async createCategory(CategoryData : CategoryDto){

        const {type,subType } =CategoryData; 
        try{
            
            const newCategory = await this.CategorysModel.create({
                type : type,
                subType:subType
            })

         await newCategory.save()
            return {
                message : "CategoryCreated" }
        }catch(error){
            return error
        }

    }
    async getCategories(queryParams: queryDto) {
        const { page = 1, recordsPerPage = 15, search } = queryParams;
        const totalResult = await this.CategorysModel.find().countDocuments();
        const result = await this.CategorysModel
          .find({
            $or: [{ name: { $regex: `^${search}`, $options: 'i' } }],
          })
          .sort({ createdAt: -1 })
          .skip((+page - 1) * +recordsPerPage)
          .limit(+recordsPerPage);
    
        return {
          data: result,
          totalRecords: result.length,
        };
      }
    
      async getCategorybyId(id) {
        const Category = await this.CategorysModel.findById(id).exec();
        return Category;
      }
    
      async deleteCategory(id) {
        const Category = await this.CategorysModel.deleteOne(id);
        return Category;
      }
      async updateCategory(CategoryId, CategoryToPost) {
     
          const {
           type,
           subType
          } = CategoryToPost;
          await this.CategorysModel.updateMany(
            { _id: CategoryId },
            {
           type:type,
           subType:subType
            },
          );
          const updatedCategory = this.getCategorybyId(CategoryId);
          return updatedCategory;
        }
    
      

}
