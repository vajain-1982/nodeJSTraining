var express= require('express');
var bp = require('body-parser');
var _ = require('underscore');

var mongoClient=require('mongodb').MongoClient;



var app= express();
app.use(bp.json());
var db;
mongoClient.connect('mongodb://admin:admin@ds111188.mlab.com:11188/vardb',(err,database)=>{
	if(err)return console.log(err)
		db=database
})

app.use(express.static('public'))

var tasks =[];
var taskId=1;

app.get('/getMyTasks', function (req, res) {
	res.send(tasks);
})
app.post('/postMyTask', (req, res) =>{
	db.collection('userdb').save(req.body,(err,result) =>{
		if(err)return console.log(err)
			console.log('saved to database')
			res.send('saved to database');		
	})
})

app.get('/getMyTask/:id', function (req, res) {
  var todoId=parseInt(req.params.id,10);
  var matchedTask=_.findWhere(tasks,{id:todoId});
  if(matchedTask){
	  res.send(matchedTask);
  }
  else{
	  res.status(404).send();
  }
})

app.delete('/deleteTask', function (req, res) {
 db.collection('userdb').findOneAndDelete({des: req.body.des},(err,result) =>{
		if(err)return  res.status(505,err);
			res.send('record deleted');		
	})
})


app.put('/updateTask', function (req, res) {
	console.log('test');
 db.collection('userdb').findOneAndUpdate({des: req.body.des},{
	 $set:{
		 des:req.body.des,
		 status:req.body.status
	 }
 },{
	 sort:{_id:-1},
	 upsert:true	 
 },(err,result) =>{
		if(err)return  res.set(err);
			res.send(result);		
	})
})

app.listen(3000,function(){
console.log('app is running on port 3000');
})