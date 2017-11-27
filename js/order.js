// Order PAGE SCRIPTS
var price = [];					// Price array is global, meaning it can be used in any script.
	price[0] = 42.00;
	price[1] = 32.00;
	price[2] = 98.00;
	price[3] = 28.00;

function productSelection() {
	if(document.order.prod.value == "plane") {
		document.order.price.value = price[0].toFixed(2);         // For each drop down option, the corresponding price and and default qty appears.
		document.order.qty.value = 1;
		}
			else if(document.order.prod.value == "kraft") {
				document.order.price.value = price[1].toFixed(2);
				document.order.qty.value = 1;
				}
					else if(document.order.prod.value == "doodler") {
						document.order.price.value = price[2].toFixed(2);        
						document.order.qty.value = 1;
					}
						else if(document.order.prod.value == "rubiks") {
						document.order.price.value = price[3].toFixed(2);        // this script could be reused multiple times by modfying the form names.
						document.order.qty.value = 1;
						}
							else if(document.order.prod.value == "default") {
							alert("Please select your item.")
							document.order.price.value = "";
							document.order.qty.value = "";
						}
							document.getElementById("cost").value= "";
		}


function subtract() {
// Determines if discount code is valid and determines amount of discount applicable to each code.   
var code = [];							
	code[0] = "EGGNOUGHT";
	code[1] = "MAROON5";									    // Discount codes defined in array. 
	code[2] = "STAR10";											// Therefore can easily change or
	code[3] = "CROWN20";										// add discount codes in future.
	code[4] = "";
	
var prodQty = parseFloat(document.order.price.value * document.order.qty.value).toFixed(2);	
var ds = document.order.disc.value;

	switch (true)
			{
			case (ds == code[0]):
			document.order.cost.value = (prodQty - (document.order.price.value * 0)).toFixed(2);			 // case discount code entered = "EGGNOUGHT", discount is 0%
  			break;
			
			case (ds == code[1]):
			document.order.cost.value = (prodQty  - (document.order.price.value * 0.05)).toFixed(2);		// case discount code entered = "MAROON5", discount is 5%
			break;
			
			case (ds == code[2]):
			document.order.cost.value = (prodQty  - (document.order.price.value * 0.10)).toFixed(2);		// case discount code entered = "STAR10", discount is 10%
			break;
			
			case (ds == code[3]):
			document.order.cost.value = (prodQty  - (document.order.price.value * 0.20)).toFixed(2);		// case discount code entered = "CROWN20", discount is 0%
  			break;
			
			case (ds == code[4]):
			document.order.disc.focus();
			document.getElementById("cost").value= "";
  			break;
			
			default:
			alert("Please enter a valid discount code.")
			document.order.disc.focus();
			document.getElementById("disc").value= "";
			break;
			}

}

var total;
var i;

function calculateTotal() {
// Calculate and display order total.
var shipCost= 0;
var shipSpeed =[];
	shipSpeed[0] = 0;
	shipSpeed[1] = 5;
	shipSpeed[2] = 10;
	
var discountCost = parseFloat(document.order.cost.value);

			if(document.order.ship.value == "default"){
			shipCost = shipSpeed[0];
			}
			else if(document.order.ship.value == "standard"){
			shipCost = shipSpeed[1];
			}
			else if(document.order.ship.value == "express") {
			shipCost = shipSpeed[2];									  // cost shipment determined by selection of standard = $5 or express = $10.
		}

		if(document.order.qty.value < 1) {
		alert("In order to calculate the total you must select a product and quantity of at least 1.")			// ensures product quantity is 1 or more.
		document.products.qty.value = 1;
		}
																												// algorithm of total calculation changes if discount code and shipping method entered.
			if (document.order.cost.value > 1) {
			total = parseFloat(shipCost + discountCost).toFixed(2);	
			document.order.total.value = total;																	// if discount code applied and shipping method selected add these values together.
			}
			else { if(document.order.cost.value < 1 && shipCost != shipSpeed[0]) {
			total = parseFloat((document.order.price.value * document.order.qty.value)+shipCost).toFixed(2);	// if discount not applied but shipping method selected, add shipping cost to
			document.order.total.value = total;																	//  product price multiplied by quantity.
			}
			else {
			total = parseFloat(document.order.price.value * document.order.qty.value).toFixed(2);				// if discount not applied and shipping method unselected, default order total is
			document.order.total.value = total;																	//  product price multiplied by quantity
			}
		}
}


function validateForm() {
// Check if valid data entered in corresponding form fields. Alert if otherwise.
		var group = document.order.notify;
		var emailID = document.order.email.value;
         atposition = emailID.indexOf("@");
         dotposition = emailID.lastIndexOf(".");

         if( document.order.firstname.value == "" )
         {
            alert( "Please provide your first name." );
            document.order.firstname.focus() ;
            return false;
         }
         
         if( document.order.lastname.value == "" )
         {
            alert( "Please provide your last name." );
            document.order.lastname.focus() ;
            return false;
         }
		 
         if(atposition < 1 || ( dotposition - atposition < 2 ) || document.order.email.value == "" )
         {
            alert("Please provide a valid email address.")
            document.order.email.focus() ;
			return false;
         }
         
         if(document.order.phone.value == "" || isNaN(document.order.phone.value) || document.order.phone.value.length != 10 )
         {
            alert( "Please provide a valid mobile number in ten-digit format. (e.g. 0424762630)" );
            document.order.phone.focus() ;
            return false;
         }

         if( document.order.address.value == "" )
         {
            alert( "Please provide your street address." );
            document.order.address.focus() ;
            return false;
         }
		 
         if( document.order.suburb.value == "" )
         {
            alert( "Please provide your suburb." );
            document.order.suburb.focus() ;
            return false;
         }
		 
         if( document.order.states.value == "default" )
         {
            alert( "Please select state/territory." );
            document.order.states.focus() ;
            return false;
         }
		 
         if( document.order.zip.value == "" || isNaN( document.order.zip.value ) || document.order.zip.value.length != 4 )			
         {
            alert( "Please provide a valid zip in four-digit format. (e.g. 5000)" );
            document.order.zip.focus() ;
            return false;
         }
		 
		 
		if(document.order.terms.checked == false) {
			alert("You must agree to our terms and conditions.");
			document.order.terms.focus() ;
			return false;
		}
		else {															
		for (var i=0; i<group.length; i++) {							 							
			if (group[i].checked)										
			break;															
			}
			if (i==group.length)													// If the other if statements are satisfied, alert user with
																					// successful order message and indication of how they will be
																					// notified based on the notification method they selected.																		
																					// After form submission, redirect user to home page.
			return 	alert( "Please select your preferred notification method." );
			alert( "Radical Dude! Your order is now being processed. You will be notified about your order shipment via notification method " + (i+1) + " shortly." );	
			window.location.href = "../pg/index.html";																							
																																				
																																				
		}																																		
         return( true );
		 
      }
