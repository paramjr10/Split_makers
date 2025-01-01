import { app } from "./app.js";
import { connectDB } from "./db/index.js";
import dotenv from 'dotenv'

dotenv.config({path:'./env'})

await connectDB()
.then(()=>{
  app.listen(process.env.PORT || 8000,()=>{
    console.log(`Sever is running on port :- ${process.env.PORT || 8000}`)
  })
})
.catch(err=>console.log("Error caught :- ",err))