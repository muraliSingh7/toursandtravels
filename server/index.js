const express=require("express")
const app=express()
const config=require("./config");

//console.log(config.backendconfig.apiURL);

app.get(config.backendconfig.apiURL+'/locations/:location',function(req,res){
    res.send("Hello World");
    console.log(req.params.location);
    getlocations(req.params.location);

});

app.listen(3000);