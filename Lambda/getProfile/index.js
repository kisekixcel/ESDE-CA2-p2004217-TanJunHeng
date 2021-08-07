var dynamodbQuery = require('dynamodb/query_dynamodb');

exports.handler = async (event, context, callback) => {
    console.log(event)
        var userId = parseInt(event.headers['user'])
        var region = "us-east-1";
        var table_name = "user";
        var proj_expr = "user_id,email,role_id,fullname"
        var expr_attr_values = { ":userid": userId }
        var key_cond_expr = "user_id=:userid"
        await dynamodbQuery(region, table_name,expr_attr_values,key_cond_expr,proj_expr)
        .then(data => {
            console.log(data)
                    console.log("Successfully got items from dynamodb.query")
                    var responseCode = 200;
                    var jsonResult = {'userdata': data.Items}
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
};
