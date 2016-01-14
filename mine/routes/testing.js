var obj1=new Object();
var obj2=new Object();
obj1.first="yash";
obj1.last="reddy";
obj2.first="manish";
console.log(JSON.stringify(obj1));
console.log(JSON.stringify(obj2));
for(var i in obj2)
{
    console.log("i is "+i);
    console.log("obj1[i] is "+obj1[i]);
    console.log("obj2[i] is "+obj2[i]);
    obj1[i]=obj2[i];
}
console.log(JSON.stringify(obj1));