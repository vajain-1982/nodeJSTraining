var express= require('express');
var bp = require('body-parser');
var _ = require('underscore');

var app= express();
app.use(bp.json());

app.use(express.static('public'))

var tasks =[];
var taskId=1;

app.get('/getMyTasks', function (req, res) {
	res.send(tasks);
})
app.post('/postMyTask', function (req, res) {
  var data=req.body;
  data.id=taskId++;
  tasks.push(data);
  res.json(data);
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

app.delete('/deleteTask/:id', function (req, res) {
  var todoId=parseInt(req.params.id,10);
  var matchedTask=_.findWhere(tasks,{id:todoId});
  if(!matchedTask){
	   res.status(404).json({"error":"id not found" ,"id":todoId});
  }
  else{
	  tasks=_.without(tasks,matchedTask);
	  res.send(matchedTask);
	 
  }
})

app.listen(3000,function(){
console.log('app is running on port 3000');
})