/////////////////////GERAGE/////////////////

//GET : GET ALL GARAGES DATA 
//
//*   https://carappdev.herokuapp.com/api/garage/  *//
//
//POST : ADD GARAGES
//
//*   https://carappdev.herokuapp.com/api/garage/  *//
//   BODY
{
	"name":"Any Name", 
	"listOfImages":["img1","img2","img3"],
    "GeragePassword": "123456",
    "workerEmail":[],   //Lengthy Bakayfy xota
    "ownerEmail":"Mawlan@microsoft.com"   //Gar Accountaka nabe Errorak wardagre banawe Id of Undefined 
}

//PATCH : Update Garage 
//
//*   https://carappdev.herokuapp.com/api/garage/5e91182fd05b3f001734e21c  *// < ID 
// 
//OPTIONS you Have :  OwnerId Cannot be changed
{
 "name": "Hello world",
 "listOfImages":["img1","img2","img3"],
 //SPECIALS
 "published": true,              //Agar Bbta False , Hamw worker w owner aka isGarage y Dabta False wa ba3akasawash
 "GeragePasswordNew":"431432",     
 "workerEmail":"raman3@microsoft.com"  //loway worker zyad kay ya kam kay , agar - w space zya kay lapeshe awa kam dabtawa
 //Agat lebe dabe userakan bwneyan habe
}

//DELETE : Delete Garage
//
//*   https://carappdev.herokuapp.com/api/garage/5e91182fd05b3f001734e21c  *// < ID 
// 
//Hamw postakane garagakash namenen lagar delete bwne :) 



//===============================CARS=============================================================//

// ADD A CAR :
//*   https://carappdev.herokuapp.com/api/cars  *// < ID 
//
//Bas Aw Fieldanay Zyad bwa!
{"garagePassword":"12345",  //AGAR isGarage True Be w Individual False be daway password daka
"individual":true         //Agar true be wata ba shaxsy xoy postaka daka
}


