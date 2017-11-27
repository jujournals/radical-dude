// In order to save time wizard was used to make simple rollover buttons.
function MM_preloadImages() { //v3.0
  var d=document; if(d.images){ if(!d.MM_p) d.MM_p=new Array();
    var i,j=d.MM_p.length,a=MM_preloadImages.arguments; for(i=0; i<a.length; i++)
    if (a[i].indexOf("#")!=0){ d.MM_p[j]=new Image; d.MM_p[j++].src=a[i];}}
}
function MM_swapImgRestore() { //v3.0
  var i,x,a=document.MM_sr; for(i=0;a&&i<a.length&&(x=a[i])&&x.oSrc;i++) x.src=x.oSrc;
}
function MM_findObj(n, d) { //v4.01
  var p,i,x;  if(!d) d=document; if((p=n.indexOf("?"))>0&&parent.frames.length) {
    d=parent.frames[n.substring(p+1)].document; n=n.substring(0,p);}
  if(!(x=d[n])&&d.all) x=d.all[n]; for (i=0;!x&&i<d.forms.length;i++) x=d.forms[i][n];
  for(i=0;!x&&d.layers&&i<d.layers.length;i++) x=MM_findObj(n,d.layers[i].document);
  if(!x && d.getElementById) x=d.getElementById(n); return x;
}

function MM_swapImage() { //v3.0
  var i,j=0,x,a=MM_swapImage.arguments; document.MM_sr=new Array; for(i=0;i<(a.length-2);i+=3)
   if ((x=MM_findObj(a[i]))!=null){document.MM_sr[j++]=x; if(!x.oSrc) x.oSrc=x.src; x.src=a[i+2];}
}





// Login SCRIPTS
// Ensures the user signs in before accessing website.
function requireLogin() {
	alert("Please sign in to access Radical Dude.")		
}
function loginForm() {
        var un = document.loginform.usr.value;
        var pw = document.loginform.pword.value;
        var username = "RadicalDude"; 
        var password = "retrofuturistic";
        if ((un == username) && (pw == password)) {								// if the correct username and password is entered the user can access the other pages.
            return true;
        }
        else {
            alert ("Login was unsuccessful, please check your username and password.");
            return false;
        }
  }




// Quiz PAGE SCRIPTS
// Each question and corresponding multiple choice answers are held within '' and each answer is separated by ~
// Order of answers are A, B, C, D and therefore results depend on if customer answers mostly A, B, C or D 
var quizArray = [
'When you want to get somewhere, you:~Ride a helicopter.~Float away on a hot air balloon.~Lay there and hope to be magically transported.~Scoot around on your Vespa.~~~~',
'Choose a fictional retrofuturistic world you would like to live in.~Blade Runner~Lost in Space~The Jetsons~The Fifth Element~~~~',
'Pick a Futurama character.~Leela~Bender~Fry~The Professor~~~~',
'Weekends are for:~Jet setting and traveling.~Hanging out with friends.~Starting your next art project.~Getting ahead on homework.~~~~'
];

var resPage = 'results'; // prefix to corresponding page of either A B C or D (e.g. resultsA.html) 
var qpp = 1; // questions per page to display
// See js file "quiz.js" in js folder.




// Discount PAGE SCRIPTS
// See js file "wheel.js" in js folder.




// Order PAGE SCRIPTS
// See js file "order.js" in js folder.

			