const express = require("express");
const mongoose=require("mongoose");
const Review=require("./reviews.js");
const path = require("path");
const { app } = require("../app");
const Schema=mongoose.Schema;

const listingSchema=new Schema({
    title:{
        type:String,
        required:true,
    },
    description:String,
    image:{
        type:String,
        default:"https://images.unsplash.com/photo-1651955881691-ebe36be1a450?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        set: (v)=>v === ""
        ? "https://images.unsplash.com/photo-1651955881691-ebe36be1a450?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D":v,
    },
    price:Number,
    location:String,
    country:String,
    reviews:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Review",
    }]
})

const Listing=mongoose.model("Listing",listingSchema);
module.exports=Listing;

