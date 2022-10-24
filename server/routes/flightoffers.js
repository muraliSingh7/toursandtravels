import express from './index.js';
import baseURL from './amadeus/amadeusapi';
import config from './config';
import getflightoffers from './routes/getflightoffers';

const router=express.Router();


function pathbuilder(arr){
    let URL='';
    arr.forEach((key)=>{
        URL += '/' + key + '/:' + key;
    })
    
    return URL;
}

/*Object demo={'origin':,
'destination':,
''}*/
callparameters=['origin','destination'];
var path=pathbuilder(callparameters);
console.log(path);

router.get(config.backendconfig.apiURL+'/flights/one-way/:from/:to/:departdate/:adult/:children'+path,(req,res)=>{
    
    console.log(req.params);
    /*var data=getflightoffers(req.params.origin,
    req.params.destination,
    req.params.departdate,req.params.returndate,
    req.params.offers['adults'],req.params.offers['children'],
    req.params.offers['travelClass']
    )*/

    //console.log(data);    
    //res.send(data);

})