$(document).ready(function() {
	
	/************************************************************\
						Click actions
	\************************************************************/
	
	$("body").on("click", "[data-action]", function(e) {
		var action = $(this).attr("data-action");
		var fn = window[action];
		if(typeof fn === "function" && action !== "cancel" && action !== "close") {
			var source;
			var event;
			if($(this).attr("data-this") == "true") {
				source = $(this);
			}
			if($(this).attr("data-e") == "true") {
				event = e;
			}
			
			if(source === undefined && event === undefined) {
				fn();
			}
			else if(event === undefined) {
				fn(source);
			}
			else if(source === undefined) {
				fn(event);
			}
			else {
				fn(event, source);
			}
		}
		else {
			throwError("Function not found");
		}
	});
	
});

function throwError(msg) {
	console.log("Error:");
	console.log(msg);
}

Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

/************************************************************\
Makes an ajax call to ajax.php
attrs: hash-table of attributes with keys and values to be passed in the request
win: a window name or element that is closed on a successful request
login: boolean wether to send login info in the request (true), or not (false)
asynch: is the request asynchronous (true) or not (false)
successFunction: a function that is called on successful request
\************************************************************/
function postAjax(attrs, successFunction, errorFunction) {
	asynch = true;
	var retResponse = Array();
	$.ajax({
		type: 'POST',
		url: 'ajax.php',
		data: attrs,
		async: asynch,
		success: function(response) {
			var responseError = false;
			try {
				response = $.parseJSON(response);
			}
			catch(err) {
				responseError = true;
				console.log("Ajax response parse error");
				console.log(response);
				console.log(err);
			}
			if(!responseError && !response['error']) {
				if(typeof(successFunction) == "function") {
					successFunction(response['result']);
				}
				retResponse = response['result'];
			}
			else {
				retResponse = response;
				throwError("Ajax error: "+response['errorMessage']);
				if(typeof(errorFunction) == "function") {
					errorFunction(response);
				}
			}
		},
		error: function(response, status) {
			throwError("Error retrieving data from the server");
			retResponse = {'error' : "true", 'errorMessage' : "Error retrieving data from the server"};
		}
	});
	return retResponse;
}