const process=require('process');
const Amadeus = require('amadeus');
const express=require("express")
const app=express()

const amadeus = new Amadeus({
    clientId:"07jzwkv2FlrcJ6UX0BRA5OcG6dGFTl6i",
    clientSecret:"3CKPw8ZrZp7igUnM"
});
//process.env.amadeus_client_id,


/*app.get(config.backendconfig.apiURL+'/locations/:location',function(req,res){
app.get('/',function(req,res){
//    res.send("Hello World");
//    console.log(req.params.location);
   
    
});*/

app.get('/flights/one-way/:from/:to/:departdate/:adult/:children',(req,res)=>{
    
    console.log(req.params);
    amadeus.shopping.flightOffersSearch.get({
        originLocationCode: req.params.from,
        destinationLocationCode: req.params.to,
        departureDate: req.params.departdate,
        adults: '1'
    }).then(function(response){
      console.log(response.data);
    }).catch(function(responseError){
      console.log(responseError.code);
    });

    
    /*var data=getflightoffers(req.params.from,
    req.params.to,
    req.params.departdate,"",
    req.params.adult,req.params.children,
    req.params.offers['travelClass']
    )*/

    //console.log(data);    
    //res.send(data);

})
app.listen(3000);
console.log("Server started on port 3000");