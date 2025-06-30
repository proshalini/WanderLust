const mongoose=require("mongoose");
const initdata=require("./data.js");
const Listing=require("../models/listing.js");
const mongo_url="mongodb://127.0.0.1:27017/wanderlust";
main()
.then(()=>{console.log("connected to database")})
.catch(err=>{console.log(err)});
async function main(){
    await mongoose.connect(mongo_url);
};
const initDB=async ()=>{
    await Listing.deleteMany({});
    initdata.data=initdata.data.map((obj)=>({...obj,owner:"685d9e27b5f751ca76f4b6d0"}));
    await Listing.insertMany(initdata.data);
    console.log("data was intialized");
}

initDB();