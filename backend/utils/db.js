import mongoose from "mongoose";


const connectDB = async() => {
    try {
        console.log('MONGO_URL:');
       await mongoose.connect(process.env.MONGO_URL);

       console.log('mongodb connect successfully!');
    } catch (error) {
        console.log('Error connecting to MongoDB:', error);

        console.log(error);
    }
}
export default connectDB