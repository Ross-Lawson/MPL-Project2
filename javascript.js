var mainContainer, content, priceDiv, resultDiv;

var prices = {
	'Aberdeen' : {
		'light' : {
			'initial' : 3.5,
			'extra' : 0.8
		},
		'heavy' : {
			'initial' : 9.5,
			'extra' : 0.5
		}
	},
	'Glasgow' : {
		'light' : {
			'initial' : 4.5,
			'extra' : 1.0
		},
		'heavy' : {
			'initial' : 16.0,
			'extra' : 2.0
		}
	},
	'London' : {
		'light' : {
			'initial' : 6.0,
			'extra' : 1.5
		},
		'heavy' : {
			'initial' : 21.0,
			'extra' : 3.0
		}
	}
};

$(document).ready(function() {

	mainContainer = $(".mainContainer");
	content = mainContainer.find(".content");
	
	initGui();
	
	content.on("change", "select[name=city]", function(e) {
		showPrices(this);
	});
	
	content.on("keyup", "input[name=weight]", function(e) {
		calculatePrice();
	});
	
});

function initGui() {
	var elem = '';
	elem += '<div class="options">';
	elem += '<div class="citySelection">Ship to: <select name="city">';
	for(var i in prices) {
		elem += '<option value="'+i+'">'+i+'</option>';
	}
	elem += '</select></div>';
	elem += '<div class="inputFields">';
	elem += 'Weight of your document/parcel: <input type="text" name="weight" value=""> grams';
	elem += '</div>';
	elem += '</div>'; // options
	content.html(elem);
	priceDiv = $('<div class="prices"></div>');
	content.prepend(priceDiv);
	resultDiv = $('<div class="resultPrice">Price: </div>');
	content.append(resultDiv);
	showPrices();
}

function showPrices() {
	var active = content.find("select[name=city]").val();
	var elem = '<div class="smallTitle">Shipping to '+active+'</div>';
	elem += '<div class="table">';
	elem += '<div class="cell">Document, below 2kg'+'</div><div class="cell">&nbsp;</div>';
	elem += '<div class="cell">Parcel, over 2kg'+'</div><div class="cell">&nbsp;</div>';
	elem += '<div class="cell">First 500gm</div><div class="cell">£'+prices[active]['light']['initial']+'</div>';
	elem += '<div class="cell">2kg - 2.5kg</div><div class="cell">£'+prices[active]['heavy']['initial']+'</div>';
	elem += '<div class="cell">Additional 250gm</div><div class="cell">£'+prices[active]['light']['extra']+'</div>';
	elem += '<div class="cell">Additional 500gm</div><div class="cell">£'+prices[active]['heavy']['extra']+'</div>';
	elem += '</div>';
	priceDiv.html(elem);
}

function calculatePrice() {
	var active = content.find("select[name=city]").val();
	var weight = parseInt(content.find("input[name=weight]").val());
	var price = 0;
	if(weight <= 2000) {
		price = prices[active]['light']['initial'];
		extraWeight = weight - 500;
		if(extraWeight > 0) {
			price += Math.ceil(extraWeight / 250) * prices[active]['light']['extra'];
		}
	}
	else {
		price = prices[active]['heavy']['initial'];
		extraWeight = weight - 2500;
		if(extraWeight > 0) {
			price += Math.ceil(extraWeight / 500) * prices[active]['heavy']['extra'];
		}
	}
	resultDiv.html("Price: £"+price);
}