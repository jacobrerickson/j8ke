import 'dotenv/config';
import "./index";

import ClassificationModel from '../models/classifications';
import newJobModel from '../models/newjobs';
import ProductsModel from '../models/products';

export async function wipeDB() {
    await ClassificationModel.deleteMany({});
    await newJobModel.deleteMany({});
    await ProductsModel.deleteMany({});

    console.log("Database wiped successfully");
    process.exit(0);
}