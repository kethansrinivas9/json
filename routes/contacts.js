var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var fs=require('fs');
//-------------------------------------
//FILE SYSTEM
var getNumOfContacts = function(){
    var flag=false;
    var fileUrl = "./data/meta.json";
    var fd;
    var ret;
    try{
        console.log("enter try");
        ret=fs.readFileSync(fileUrl);
        console.log("no excep");
    }
    catch(err)
    {
        var obj=new Object();
        obj.num=Number(0);
        fs.writeFile(fileUrl,JSON.stringify(obj));
        flag=true;
    }
    console.log("returning :"+ret);
    if(flag)
        return 0;
    return JSON.parse(ret).num;
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
router.get('/', function(req, res, next) {
	 var num = getNumOfContacts();
	 var count=1;
	 var i;
	 var str="";
	 var str2="[";
	 var obj1=new Object();
	 console.log("num"+num);
	for(i=1;count<=num;i++,count++)
	{	
		try
		{
			str=JSON.stringify(getContactFromFile(i));
			console.log(str);
			str.concat(JSON.stringify(getContactFromFile(i)));
			if(count!=1)
				str2=str2.concat(",\n");
			str2=str2.concat(str);
			//count++;
		}
		catch(err)
		{
			console.log("exception catched"+i);
		}
	}
	str2=str2.concat("]")
	//JSON.parse(str2);
	res.send(str2);
	//res.send({"status":"success"});
});


//saves a contact
router.post('/', function(req, res, next) {
    console.log("request to add");
    var con;
    con = req.body;
	console.log(typeof(con)+"sdflasdkfl"+req.json);
    var num = getNumOfContacts();
	writeContactToFile(num+1,con);
    putNumOfContacts(num+1);
    res.send({"id":num+1});
});

//modifies a contact
router.put('/:id', function(req,res,next) {
    var obj1=getContactFromFile(+req.params.id);
    var obj2=req.body;
	console.log("before");
	console.log(req.body);
	for(var i in obj1)
	{
		obj1[i]="";
	}
    for(var i in obj2)
    {
		obj1[i]=obj2[i];
    }
	console.log("after");
    writeContactToFile(+req.params.id,obj1);
	res.send({"status":"success"});
});

router.patch('/:id',function(req,res){
	console.log("entered");
	var obj1=getContactFromFile(+req.params.id);
    var obj2=req.body;
    for(var i in obj2)
    {
		obj1[i]=obj2[i];
    }
    writeContactToFile(+req.params.id,obj1);
	res.send({"status":"success"});
});


router.delete('/:id',function(req,res,next){
	try{
	deleteContactsFromFile(+req.params.id);
	}
	catch(err)
	{
		res.send("{the record doesnot exist}")
	}
	res.status(200).send({"status":"success"});
});
module.exports = router;
