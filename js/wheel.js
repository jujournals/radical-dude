// Declaring and initialising variables.
var canvasId         = "myDrawingCanvas";   // Id of the canvas element on the page the wheel is to be rendered on.
var wheelImageName   = "../img/spin/prizewheel.png";	// File name of the image for the wheel.
var spinButtonImgOn  = "../img/spin/spin_on.png";		// Name / path to the images for the spin button.
var spinButtonImgOff = "../img/spin/spin_off.png";
var theSpeed         = 20; 		 // Controls how often the spin function is called (is miliseconds value for animation timer).
var pointerAngle     = 0;  	 	 // The angle / location around the wheel where the pointer indicaing the prize is located.
var doPrizeDetection = true; 	 // Set to true to detect the prize the user has won when the spinning has stopped. Prizes need to be specified in the prizes array.
var spinMode         = "random"; // Values are random

// Items in the array correspond to the prizes in the segments of the wheel.
var prizes = new Array();
prizes[0] = {"name" : "EGGNOUGHT", "startAngle" : 0,   "endAngle" : 44};  // Note how prize end angle is 1 less than start angle of next prize so no overlap.
prizes[1] = {"name" : "MAROON5", "startAngle" : 45,  "endAngle" : 89};
prizes[2] = {"name" : "EGGNOUGHT", "startAngle" : 90,  "endAngle" : 134};
prizes[3] = {"name" : "CROWN20", "startAngle" : 135, "endAngle" : 179};
prizes[4] = {"name" : "EGGNOUGHT", "startAngle" : 180, "endAngle" : 224};
prizes[5] = {"name" : "MAROON5", "startAngle" : 225, "endAngle" : 269};
prizes[6] = {"name" : "EGGNOUGHT", "startAngle" : 270, "endAngle" : 314};
prizes[7] = {"name" : "STAR10", "startAngle" : 315, "endAngle" : 360};

var surface;		   // Set to the drawing canvas object in the begin function.
var wheel;			   // The image of the face of the wheel is loaded in to an image object assigned to this var.
var angle 		 = 0;  // Populated with angle figured out by the threshold code in the spin function.
var targetAngle  = 0;  // Set before spinning of the wheel begins by startSpin function depending on spinMode.
var currentAngle = 0;  // Used during the spin to keep track of current angle.
var power        = 0;  // Set when the power is selected. 1 for low, 2 for med, 3 for high.

// This is set in the startSpin function to a random value within a range so that the last speed of the rotation of the wheel
// does not always happen at the same point before the prize the user will win. See comments in doSpin where this variable is located.
var randomLastThreshold = 150;

// Pointer to the setTimout for the call to the doSpin function. Is global var so can clear the timeout if reset is clicked before wheel has stopped spinning.
var spinTimer;

// Used to track status of the wheel, set to 'spinning' when the wheel is spinning.
// Note: spin button will only work again after wheel has been reset.
var wheelState = 'reset';

// This function is called by the code on the page after loading. It gets the canvas and loads the wheel image.
function begin() 
{
	// Get Canvas element
	surface = document.getElementById(canvasId);

	// If canvas is supported then load the image.
	if (surface.getContext) 
	{
		wheel = new Image();
		wheel.onload = initialDraw;		// Once the image is loaded from file this function is called to draw the image in its starting position.
		wheel.src = wheelImageName;
	}
}

// This function draws the wheel on the canvas in its intial position. Without it only the background would be displayed.
function initialDraw(e)
{
	var surfaceContext = surface.getContext('2d');
	surfaceContext.drawImage(wheel, 0, 0);
}

// This function is called when the spin button is clicked, it works out the targetAngle using the specified spin mode, then kicks off the spinning.
function startSpin(determinedValue)
{
	// This is the angle (0-360) around the wheel that is to be positioned where the pointer is located when the wheel stops.
	var stopAngle;	
	
	if (spinMode == "random")
	{
		// Wheel stops at random, so get a random whole number between 0 and 360 degrees.
		stopAngle = Math.floor(Math.random() * 360);
	}
		else
		{
			//Make the stopAngle a random value between the startAngle and endAngle of the prize so when the wheel stops the pointer is pointing to
			// a random place inside the segment displaying the prize (random inside is nicer than always dead center).
			stopAngle = Math.floor(prizes[determinedValue]['startAngle'] + (Math.random() * (prizes[determinedValue]['endAngle'] - prizes[determinedValue]['startAngle'])));
		}
	
	// If stopAngle defined then have the needed information  to work out final things such as the targetAngle and then kick off the spinning of the wheel.
	// Only do this if the wheel is in fresh state (not curently spinning or has stopped after a spin) and the power has been selected.
	if ((typeof(stopAngle) !== 'undefined') && (wheelState == 'reset') && (power))
	{
		// Make the prize at that location pointed to by the pointer that indicates the prize requires
		// adjusting the value taking in to account the location of the pointer.
		// This is the location of pointer, minus the stopAngle. 360 is added to ensure that value is not negative.
		stopAngle = (360 + pointerAngle) - stopAngle;
		
		// Now that is sorted set the targetAngle of the wheel. Once the spinning is started it will keep going until the targetAngle is met.
		// This value needs to be based on the power and have the stopAngle added to it. Basically more power the larger the targetAngle needs to be.
		targetAngle = (360 * (power * 6) + stopAngle);
		
		// Also set the randomLastThreshold to a value between 90 and 180 so that user cannot always tell what prize they will win before the wheel
		// stops, which is the case if the last threshold is always the same as the user can see the wheel slow to 1 degree of rotation the same 
		// distance before it stops each time. See further comments in doSpin function where this is used.
		randomLastThreshold = Math.floor(90 + (Math.random() * 90));
		
		// Set Spin button image back to disabled one, since can't click again until the wheel is reset.
		document.getElementById('spin_button').src       = spinButtonImgOff;
		document.getElementById('spin_button').className = "";
		
		// Now kick off the spinning of the wheel by calling the doSpin function.
		wheelState = 'spinning';
		doSpin();
	}
}

// This function actually rotates the image making it appear to spin, a timer calls it repeatedly to do the animation.
// The wheel rotates until the currentAngle meets the targetAngle, slowing down at certain thresholds to give a nice effect.
function doSpin() 
{	
	// Grab the context of the canvas.
	var surfaceContext = surface.getContext('2d');

	// Save the current context fo later storage.
	surfaceContext.save();
	
	// Translate to the center point of image.
	surfaceContext.translate(wheel.width * 0.5, wheel.height * 0.5);
	
	// Perform the rotation by the angle specified in the global variable (will be 0 the first time).
	surfaceContext.rotate(DegToRad(currentAngle));
	
	// Translate back to the top left of image.
	surfaceContext.translate(-wheel.width * 0.5, -wheel.height * 0.5);
	
	// Finally draw the rotated image on the canvas.
	surfaceContext.drawImage(wheel, 0, 0);
	
	// And restore the context ready for the next loop.
	surfaceContext.restore();


	// Add angle worked out below by thresholds to the current angle as increment the currentAngle up until the targetAngle is met.
	currentAngle += angle;
	

	// If the currentAngle is less than targetAngle rotate some more, so figure out what the angle the wheel is to be rotated 
	// by next time this function is called, then set timer to call this function again in a few milliseconds.
	if (currentAngle < targetAngle)
	{
		// Control how fast the wheel spins by setting how much is it to be rotated by each time this function is called.
		// In order to do a slowdown effect, start with a high value when the currentAngle is further away from the target
		// and as it is with certian thresholds / ranges of the targetAngle reduce the angle rotated by - hence the slowdown effect.
		
		// The 360 * (power * 6) in the startSpin function will give the following...
		// HIGH power = 360 * (3 * 6) which is 6480
		// MED power = 360 * (2 * 6) which equals 4320
		// LOW power = 360 * (1 * 6) equals 2160.
		
		// Work out how much is remaining between the current angle and the target angle.
		var angleRemaining = (targetAngle - currentAngle);
		
		// Now use the angle remaining to set the angle rotated by each loop, reducing the amount of angle rotated by as
		// as the currentAngle gets closer to the targetangle.
		if (angleRemaining > 6480)
			angle = 55;
		else if (angleRemaining > 5000)		
			angle = 45;						
		else if (angleRemaining > 4000)
			angle = 30;
		else if (angleRemaining > 2500)
			angle = 25;
		else if (angleRemaining > 1800)
			angle = 15;
		else if (angleRemaining > 900)
			angle = 11.25;
		else if (angleRemaining > 400)
			angle = 7.5;
		else if (angleRemaining > 220)					
			angle = 3.80;								
		else if (angleRemaining > randomLastThreshold)	
			angle = 1.90;								// This variable is set in the startSpin function.
		else
			angle = 1;		// Last angle should be 1 so no risk of the wheel overshooting target if using preDetermined spin mode 
							// (only a problem if pre-Determined location is near edge of a segment).
		
		// Set timer to call this function again using the miliseconds defined in the speed global variable.
		// This effectivley gets creates the animation / game loop.
		spinTimer = setTimeout("doSpin()", theSpeed);
	}
	else
	{
		// currentAngle must be the same as the targetAngle so reached the end of the spinning.
		
		// Update this to indicate the wheel has finished spinning.
		wheelState = 'stopped';
		
		// If to do prize dection then work out the prize pointed to.
		if ((doPrizeDetection) && (prizes))
		{
			// Get how many times the wheel has rotated past 360 degrees.
			var times360 = Math.floor(currentAngle / 360);
			
			// From this compute the angle of where the wheel has stopped - this is the angle of where the line between 
			// segment 8 and segment 1 is because this is the 360 degree / 0 degree (12 o'clock) boundary when then wheel first loads.
			var rawAngle = (currentAngle - (360 * times360));
			
			// The value above is still not quite what need to work out the prize.
			// The angle relative to the location of the pointer needs to be figured out.
			var relativeAngle =  Math.floor(pointerAngle - rawAngle);
			
			if (relativeAngle < 0)
				relativeAngle = 360 - Math.abs(relativeAngle);
					
			// Now work out the prize won by seeing what prize segment startAngle and endAngle the relativeAngle is between.
			for (x = 0; x < (prizes.length); x ++)
			{
				if ((relativeAngle >= prizes[x]['startAngle']) && (relativeAngle <= prizes[x]['endAngle']))
				{
					alert("Congratulations. Your discount code is: " + prizes[x]['name'] + "\nYou will now be taken to the Order page.");
					window.location.href = "../pg/order.html";
					break;
				}
			}
		}
	}
}

// Function that converts the degrees to radians.
function DegToRad(d) 
{
	return d * 0.0174532925199432957;
}

// This function sets the class name of the power TDs to indicate what power has been selected, and also sets power variable used by startSpin code.
// It is called by the onClick of the power table cells on the page. 
function powerSelected(powerLevel)
{
	// In order to stop the change of power duing the spinning, only do this if the wheel is in a reset state.
	if (wheelState == 'reset')
	{
		// Reset all to grey incase this is not the first time the user has selected the power.
		document.getElementById('pw1').className = "";
		document.getElementById('pw2').className = "";
		document.getElementById('pw3').className = "";
		
		// Now light up all cells below-and-including the one selected by changing the class.
		if (powerLevel >= 1)
			document.getElementById('pw1').className = "pw1";
			
		if (powerLevel >= 2)
			document.getElementById('pw2').className = "pw2";
			
		if (powerLevel >= 3)
			document.getElementById('pw3').className = "pw3";
		
		// Set internal power variable.
		power = powerLevel;
		
		// Light up the spin button by changing it's source image and adding a clickable class to it.
		document.getElementById('spin_button').src = spinButtonImgOn;
		document.getElementById('spin_button').className = "clickable";
	}
}

// This function re-sets all vars as re-draws the wheel at the original position. Also re-sets the power and spin buttons on the example wheel.
function resetWheel()
{
	// Ensure that if wheel is spining then it is stopped.
	clearTimeout(spinTimer);
	
	// Re-set all vars to do with spinning angles.
	angle 		 = 0;
	targetAngle  = 0;
	currentAngle = 0;
	power        = 0;
	
	// Update styles of power buttons so they appear grey again.
	document.getElementById('pw1').className = "";
	document.getElementById('pw2').className = "";
	document.getElementById('pw3').className = "";
	
	// Make spin button disabled again until power is selected.
	document.getElementById('spin_button').src       = spinButtonImgOff;
	document.getElementById('spin_button').className = "";
	
	// Set back to reset so that power selection and click of Spin button work again.
	wheelState = 'reset';
	
	// Call function to draw wheel in start-up position.
	initialDraw();
}