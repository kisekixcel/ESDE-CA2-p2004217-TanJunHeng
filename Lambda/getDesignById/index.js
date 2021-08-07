var dynamodbQuery = require('dynamodb/query_dynamodb');

exports.handler = async function(event, context, callback){
    if (event.fid|| (event.queryStringParameters && event.queryStringParameters.fid)) {
        if (event.fid)
            var fileId = parseInt(event.fid);
        else
            var fileId= parseInt(event.queryStringParameters.fid);
            console.log(event)
        var region = "us-east-1"
        var table_name = "files"
        var expr_attr_values = { ":fileid": fileId }
        var key_cond_expr = "file_id=:fileid"
        var proj_expr = "file_id,cloudinary_url,design_title,design_description"
        await dynamodbQuery(region, table_name,expr_attr_values,key_cond_expr,proj_expr)
        .then(data => {
                    console.log("Successfully got items from dynamodb.query")
                    var responseCode = 200;
                    var jsonResult = {'filedata': data.Items[0]}
                    let response = {
                            statusCode: responseCode,
                            body: JSON.stringify(jsonResult),
                            headers: {
                                "Access-Control-Allow-Headers" : "Content-Type,user",
                                "Access-Control-Allow-Origin": "*",
                                "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
                            }
                    }
                    console.log("response: " + JSON.stringify(response))
                    callback(null, response);
            })
            .catch(error => {
                    console.log('There has been a problem with your fetch operation: ' + error.message);
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