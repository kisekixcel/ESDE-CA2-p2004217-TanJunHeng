
var
AWS = require("aws-sdk"),
DDB = new AWS.DynamoDB({
    apiVersion: "2012-08-10",
    region: "us-east-1"
}),
file_DATA_ARR = require("./user-data.json");

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
                user_id: {
                    "N": file_DATA_ARR[i_int].user_id.toString()
                },
                fullname: {
                    "S": file_DATA_ARR[i_int].fullname
                },
                email: {
                    "S": file_DATA_ARR[i_int].email
                },
                user_password: {
                    "S": file_DATA_ARR[i_int].user_password
                },
                role_id: {
                    "N": file_DATA_ARR[i_int].role_id.toString()
                }
            }
        }
    };
    file_formatted_arr.push(file);
}
params = {
    RequestItems: {
        "user": file_formatted_arr.reverse()
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