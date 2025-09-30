import mongoose from "mongoose";

const URL = "mongodb+srv://admin:123@clustertest.zzdjvmf.mongodb.net/pet_ecommerce_db";

const connectDB = async () => {
    try {
        await mongoose.connect(URL);
        console.log('MongoDB Connected to: pet_ecommerce_db');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error.message);
        process.exit(1);
    }
};

export default connectDB;