import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        await mongoose.connect(`${process.env.DATABASE_URL}/${process.env.DATABASE_NAME}`)
        console.log("Database connection successfully");
    } catch (error) {
        console.log("Database connection error",error);
        process.exit(1);
    }
}

export {connectDB}