import express from './index';
import config from './config';
import baseURL from './amadeus/amadeusapi';
import getlocations from './function_api/getlocations';
//const config=require("./config");
//const express=require('express');
const router=express.Router();
//const baseURL=require('./amadeus/amadeusapi');




router.get(baseURL+config.backendconfig.apiURL+'/locations/:location',(req,res)=>{
    var data=getlocations(req.params.location);
    console.log(data);
    //res.send(data);
});