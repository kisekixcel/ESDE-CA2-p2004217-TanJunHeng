var dynamodbUpdate = require('dynamodb/update_dynamodb');

exports.handler = async function(event, context, callback){
    if (event.fid|| (event.queryStringParameters && event.queryStringParameters.fid)) {
        if (event.fid)
            var fileId = parseInt(event.fid);
        else
            var fileId= parseInt(event.queryStringParameters.fid);
            var desn_description = event.queryStringParameters.designDescription;
            var desn_title = event.queryStringParameters.designTitle;
        console.log(event)
        var region = "us-east-1"
        var table_name = "files"
        var expr_attr_values = fileId
        var key_cond_expr = "file_id=:fileid"
        var proj_expr = "file_id,cloudinary_url,design_title,design_description"
        const result = await dynamodbUpdate(region, table_name,expr_attr_values,key_cond_expr,proj_expr,desn_description,desn_title)
        .then(data => {
            console.log(data)
            if (data) {
                    var responseCode = 200;
                    let response = {
                            statusCode: responseCode,
                            body: JSON.stringify("Successful Updated Design !"),
                            headers: {
                                "Access-Control-Allow-Headers" : "Content-Type,user",
                                "Access-Control-Allow-Origin": "*",
                                "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
                            },
                            "isBase64Encoded": true
                    }
                    console.log("response: " + JSON.stringify(response))
                    callback(null, response);
            }
                    var responseCode = 500;
                    let response = {
                            statusCode: responseCode,
                            body: JSON.stringify("Failed to Update Design"),
                            headers: {
                                "Access-Control-Allow-Headers" : "Content-Type,user",
                                "Access-Control-Allow-Origin": "*",
                                "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
                            },
                            "isBase64Encoded": true
                    }
                    console.log("response: " + JSON.stringify(response))
                    callback(null, response);
            })
            .catch(error => {
                    console.log(error)
                    console.log('Error: ' + error.message);
                    var responseCode = 500;

                    let response = {
                        statusCode: responseCode,
                        body: JSON.stringify(error)
                    }
            
                    console.log("response: " + JSON.stringify(response))
                    callback(null, response);
             });
             
             
    } //end if
}
