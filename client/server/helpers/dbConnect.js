import mongoose from "mongoose";

let isConnected = false;

const dbConnect = async () =>{
    if(isConnected){
        console.log("DB already connected!");
        return;
    }
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        isConnected = true;
        console.log("DB Connected successfully!");
    } catch (error) {
        console.log("DB connection error:", error);
        throw error; 
    }
}

export default dbConnect;