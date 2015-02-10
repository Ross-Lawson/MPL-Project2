var tooltip_e, errorTicker, lastDebounce, lastDebounceE, lastDebounceT;
var cookiePath = "facebook-dl";

$(document).ready(function() {
	$("body").on("mouseenter", "[data-tooltip]", function() {
		tooltip($(this).attr("data-tooltip"), $(this));
	});
	
	errorTicker = $(document).find(".errorTicker");
	
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

function debounceAction(e, source) {
	var action = source.attr("data-debounce-action");
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
}

function throwError(msg) {
	console.log("Error:");
	console.log(msg);
	var errorElem = $("<div class=\"error\">"+msg+"</div>");
	errorTicker.append(errorElem);
	errorElem.fadeIn(300);
	setTimeout(function() {
		errorElem.fadeOut(300, function() {
			errorElem.remove();
		});
	},4000);
}

Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

$(document).ready(function() {
	tooltip_e = $("#tooltip");
	$("[tooltip]").each(function() {
		$(this).mouseenter(function() {
			tooltip($(this).attr("tooltip"), $(this));
			tooltip_e.show();
		});
		$(this).mouseleave(function() {
			tooltip_e.hide();
		});
	});
	
});

function tooltip(text, elem) {
	var tooltip = $(".tooltip");
	tooltip.html(text);
	var left = elem.offset().left;
	var top = elem.offset().top + elem.outerHeight() + 3;
	if($(document).height() < top + tooltip.outerHeight()) {
		top = elem.offset().top - tooltip.outerHeight() - 3;
	}
	if($(document).width() < left + tooltip.outerWidth()) {
		left = $(document).width() - tooltip.outerWidth() - 3;
	}
	tooltip.show();
	tooltip.css("top", top);
	tooltip.css("left", left);
	elem.bind("mouseleave click",function() {
		elem.unbind("mouseleave");
		tooltip.hide();
	});
}

function flip(elem, state) {
	var newState;
	if(arguments.length == 1) {
		state = $(elem).attr("data-state");
		if(state == "on") {
			newState = "off";
		}
		else {
			newState = "on";
		}
	}
	else {
		newState = state;
	}
	$(elem).attr("data-state", newState);
	return newState;
}

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

/************************************************************\
Delete a cookie
name: name of the cookie
\************************************************************/
function delCookie(name) {
	setCookie(name, "", -100);
}

/************************************************************\
Set a cookie
name: name of the cookie
value: value to be set on the cookie
expireday: number of days (int) that the cookie expires in
\************************************************************/
function setCookie(name, value, expiredays) { // set a cookie
	var expiredate = new Date(new Date().getTime() + expiredays * (1000 * 60 * 60 * 24));
	document.cookie = name+"="+value+";expires="+expiredate.toUTCString()+";path="+cookiePath;
}

/************************************************************\
Returns the value of a cookie
c_name: the name of the cookie to be returned
\************************************************************/
function getCookie(c_name) { // get a cookie (function from w3cschools)
var i,x,y,ARRcookies=document.cookie.split(";");
for (i=0;i<ARRcookies.length;i++)
{
  x=ARRcookies[i].substr(0,ARRcookies[i].indexOf("="));
  y=ARRcookies[i].substr(ARRcookies[i].indexOf("=")+1);
  x=x.replace(/^\s+|\s+$/g,"");
  if (x==c_name)
    {
    return unescape(y);
    }
  }
}

/************************************************************\
Cancels the propagation and the default event of an event
e: the event-object to be cancelled
\************************************************************/
function cancel(e) {
	e.stopPropagation();
	e.preventDefault();
	return false;
}

/************************************************************\
Extends jQuery to have
$.getUrlVars: return an object with all GET-paramaters in a hash-table
$.getUrlHash: returns an object (if no arguments are passed) with all parameters in the address-bar of the
	browser after the hash-tag # in a hash-table, or just one parameter of the passed "name" argument
$.getUrlVar: return the value of a GET-parameter of the passed "name" argument
$.setUrlHash: set the value of passed "name"-argument to "val"-argument in the browsers address-bar (retainrs
	the old variables already there)
$.setUrlHashs: sets the value of the whole hash-parameter to the passed "val"-argument (deletes everything else
	prior to setting the new value)
\************************************************************/
$.extend({
  getUrlVars: function(){
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
      hash = hashes[i].split('=');
      vars[hash[0]] = hash[1];
    }
    return vars;
  },
  getUrlVar: function(name){
    return $.getUrlVars()[name];
  },
  setUrlVar: function(value){
  	window.location.href = value;
  },
  getUrlHash: function(name){
	if(window.location.href.indexOf("#") != -1) {
		var vars = {};
		var hashes = window.location.hash.substr(1).split('&');
		for(var i = 0; i < hashes.length; i++) {
		  hash = hashes[i].split('=');
		  if(hash[0] !== "") {
			vars[hash[0]] = hash[1];
		  }
		}
		if(arguments.length == 1) {
			return vars[name];
		}
		else {
			return vars;
		}
	}
	else {
		return {};
	}
  },
  setUrlHash: function(name, val) {
	//var baseurl = window.location.href.match(/^(https?:\/\/.*)[\?\/](.*)/);
	var urlvars = $.getUrlHash();
	if(urlvars == undefined) { urlvars = []; }
	if(val !== undefined && val !== "") {
		urlvars[name] = val;
	}
	else {
		delete urlvars[name];
	}
	var urlstring = "";
	for(var i in urlvars) {
		if(urlstring != "") { urlstring += "&"; }
		urlstring += i+"="+urlvars[i];
	}
	if(urlstring !== "") {
		window.location.hash = urlstring;
	}
	else {
		removeHash();
	}
  },
  setUrlHashs: function(val) {
	window.location.hash = val;
  }
});

function removeHash () { 
    if ("replaceState" in history)
        history.replaceState("", document.title, window.location.pathname + window.location.search);
    else {
        loc.hash = "";
	}
}