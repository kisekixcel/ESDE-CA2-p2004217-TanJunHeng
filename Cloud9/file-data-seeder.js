var
    AWS = require("aws-sdk"),
    DDB = new AWS.DynamoDB({
        apiVersion: "2012-08-10",
        region: "us-east-1"
    }),
    file_DATA_ARR = require("./file-2a01.json");

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
	    			file_id: {
	    				"N": file_DATA_ARR[i_int].file_id.toString()
	    			},
	    			cloudinary_file_id: {
	    				"S": file_DATA_ARR[i_int].cloudinary_file_id
	    			},
	    			cloudinary_url: {
	    				"S": file_DATA_ARR[i_int].cloudinary_url
	    			},
	    			design_title: {
	    				"S": file_DATA_ARR[i_int].design_title
	    			},
	    			design_description: {
	    				"S": file_DATA_ARR[i_int].design_description
	    			},
	    			created_by_id: {
	    				"N": file_DATA_ARR[i_int].created_by_id.toString()
	    			}
	    		}
	    	}
	    };
	    file_formatted_arr.push(file);
	}
	params = {
		RequestItems: {
			"files": file_formatted_arr.reverse()
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