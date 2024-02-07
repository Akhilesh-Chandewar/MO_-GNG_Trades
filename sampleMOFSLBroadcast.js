let MofslOpenApi = require('./MOFSLOPENAPI_NodejsV2.3');
const Redis = require('redis');
const redisClient = Redis.createClient();

redisClient.on('error', function (err) {
    console.error('Redis client error:', err);
});

// Handle Redis client connection success
redisClient.on('connect', function () {
    console.log('Redis client connected');
});

// Handle Redis client connection close
redisClient.on('end', function () {
    console.log('Redis client connection closed');
});



userID = "DIVK0707";
password = "Divk@12";
PANorDOB = "07/09/1996";
vendorId = "STROKE";
totp = "";  //Google Authenticator OTP
SourceId = "WEB";       //WEB, DESKTOP
BrowserName = "Chrome";
BrowserVersion = "104"

Apikey = "qUVfP7TM2wU1NRkE";

clientcode = "";

// Enter Base Url
// Base_Url = "https://uatopenapi.motilaloswal.com";

Base_Url = "https://openapi.motilaloswal.com"

let Mofsl = new MofslOpenApi(Apikey, Base_Url, SourceId, BrowserName, BrowserVersion);

const tokens = [44841, 44821];


Mofsl.SystemInfo().then((data) => {
    Mofsl.setdeviceModel(data.model);
    Mofsl.setManufacture(data.manufacturer);

}).then(() => {
    return Mofsl.GetPublicIP();

}).then((message) => {
    return Mofsl.setClientPublicIp(message);

}).then(() =>{
    return Mofsl.GetLocationInfo()
    
}).then((location) => {
    Mofsl.setLocationInfo(location)
    return Mofsl.Login(userID, password, PANorDOB, vendorId, totp)

}).then((message) => {
        console.log("LOGIN :: ", message);
    }).then((message) => {
    }).then((message) => {
        return Mofsl.GetMaxBroadcastLimit(clientcode);
    }).then(() => {
        return Mofsl.Broadcast_connect();
    }).then(() => {
        Mofsl.Register("NSEFO", "DERIVATIVES", 44841);
        Mofsl.Register("NSEFO", "DERIVATIVES", 44821);
        Mofsl.IndexRegister("NSE");
        // Logout Broadcast
        Mofsl.BroadcastLogout();
    })
    .catch((e) => {
        console.log("ERROR :: ", e.message);
    })

Mofsl.onBroadcast('tick', onBroadcastResponse);

async function onBroadcastResponse(message) {
    if (message.Type === "LTP") {
        console.log("LTP :: ", message);
        if (message.Type === "LTP") {
            console.log("LTP :: ", message);
            redisClient.lPush('LTP_Rates', [message.LTP_RATE], (err, reply) => {
                if (err) {
                    console.error('Error pushing data to Redis queue:', err);
                } else {
                    console.log('LTP rate pushed to Redis queue:', message.LTP_RATE);
                }
            });
        }
    }
    else {
        console.log("Broadcast Response :: ", message);
    }

   
}
