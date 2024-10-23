import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { userInterface } from './Model/auth.model';
import { Seeder } from 'nestjs-seeder';
import * as bcrypt from 'bcrypt';
const fs = require('fs');

@Injectable()
export class AuthSeeder implements Seeder {
  constructor(
    @InjectModel('admin') private readonly adminModel: Model<userInterface>,
  ) {}

  async seed(): Promise<any> {
    const authData = await JSON.parse(
      fs.readFileSync(`src/auth/data/authData.json`),
    );

    //    await newUser.save()
    // Insert into the database.
    return this.adminModel.insertMany(authData);
  }
  async generateHash(password: string, salt: string) {
    const hash = await bcrypt.hash(password, salt);
    return hash;
  }

  async drop(): Promise<any> {
    return this.adminModel.deleteMany({});
  }
}
