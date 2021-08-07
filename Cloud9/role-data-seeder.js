var
AWS = require("aws-sdk"),
DDB = new AWS.DynamoDB({
    apiVersion: "2012-08-10",
    region: "us-east-1"
}),
file_DATA_ARR = require("./role-data.json");

function addNewItemsFromJSON(){
console.log("All items now removed, re-seeding now");
var 
    file = {},
    file_formatted_arr = [],
    params = {};

for(var i_int = 0; i_int < file_DATA_ARR.length; i_int += 1){
    file = {
        PutRequest: {
            Item: {
                role_id: {
                    "N": file_DATA_ARR[i_int].role_id.toString()
                },
                role_name: {
                    "S": file_DATA_ARR[i_int].role_name
                }
            }
        }
    };
    file_formatted_arr.push(file);
}
params = {
    RequestItems: {
        "role": file_formatted_arr.reverse()
    }
};
DDB.batchWriteItem(params, function(err, data){   
    if(err){
        throw err;
    }
    console.log("OK");         
});
}

(function init(){
addNewItemsFromJSON();
})();
