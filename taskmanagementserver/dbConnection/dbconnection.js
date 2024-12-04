import mongoose from "mongoose"

const Connection = async () => {
    try{
        await mongoose.connect(`${process.env.MONGO_URI}`)
        console.log("Connected to MongoDB")
    }catch(e){
        console.log(e)
    }
}
export default Connection;