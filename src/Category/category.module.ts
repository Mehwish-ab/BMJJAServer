
import { Module } from '@nestjs/common';
import { CategoriesController } from './category.controller';
import { CategoriesService } from './category.service';
import { MongooseModule } from '@nestjs/mongoose';
import { categorySchema} from './Model/category.model';
@Module({
  imports: [ MongooseModule.forFeature([
    {name : "categories" , schema :categorySchema}
  ])
  ],
  controllers: [CategoriesController],
  providers: [CategoriesService],
})
export class CategoryModule {}
