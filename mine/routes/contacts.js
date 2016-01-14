var express = require('express');
var router = express.Router();
//var contacts=new Array();
//var messages=new Array();
var bodyParser = require('body-parser');
var fs=require('fs');
//var num=0;
//-------------------------------------
//FILE SYSTEM
var getNumOfContacts = function(){
   var num=1;
    return num;
}

var putNumOfContacts=function(value){
    console.log("writing num");
    var fileUrl = "./data/meta.json";
    var obj=new Object();
    obj.num=Number(value);
    fs.writeFile(fileUrl,JSON.stringify(obj),function(err){});
    console.log("wrotenum");
    return;
}

var writeContactToFile = function(id,obj){
    var fileUrl="./data/"+id+"-Contact.json";
    fs.writeFile(fileUrl,JSON.stringify(obj));
}
var getContactFromFile = function(id){
    var fileUrl="./data/"+id+"-Contact.json";
    var obj=fs.readFileSync(fileUrl);
    return JSON.parse(obj);
}

var deleteContactsFromFile = function(id){
	var fileUrl="./data/"+id+"-Contact.json";
	var num=getNumOfContacts();
	if(num==id)
		putNumOfContacts(id-1);
	fs.unlinkSync(fileUrl);
    console.log('successfully deleted /tmp/hello');
}

//END OF FILE SYSTEM ROUTINES
//--------------------------------------
//SERVER LISTENING ROUTINES

// sends contact
router.get('/:id', function(req, res, next){
	console.log(+req.params.id);
	try{
    res.send(getContactFromFile(+req.params.id));//contacts[(+req.params.id)]);
	}
	catch(err)
	{
		res.send("{The record doesnt exists}");
	}
});

//sends all contacts

router.get('..', function(req, res, next) {
	console.log("entered")
	res.send({"name":"kethan"});
});

//saves a contact
router.post('/', function(req, res, next) {
    console.log("request to add");
    var con;
    con = req.body;
    con.messages=new Array();
    var num = getNumOfContacts();
    writeContactToFile(num,con);
    putNumOfContacts(num+1);
    res.send(""+(num));
	//res.send("{}")
});

//modifies a contact
router.put('/:id', function(req,res,next) {
    var obj1=getContactFromFile(+req.params.id);
    var obj2=req.body;
	console.log("before");
	console.log(req.body);
    for(var i in obj2)
    {
		console.log("while");
		console.log(typeof(obj2[i]));
        console.log(obj2[i].length);
    }
	console.log("after");
    writeContactToFile(+req.params.id,obj1);
    res.send(obj1);
});

//saves a message
router.post('/:cid/message/',function(req,res,next){
    var c=getContactFromFile(+req.params.cid);
    c.messages.push(req.body);
    writeContactToFile(+req.params.cid,c);
    res.status(200).send("{"+(c.messages.length-1)+"}");
});

//sends a message of cid
router.get('/:cid/message/:mid',function(req,res,next){
    console.log("getting back");
    var c=getContactFromFile(+req.params.cid);
    res.status(200).send(c.messages[+req.params.mid]);
});

router.delete('/:id',function(req,res,next){
	res.status(200).send(deleteContactsFromFile(+req.params.id));
});
module.exports = router;
