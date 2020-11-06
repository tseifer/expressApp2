const express = require('express');
const path = require('path');
const logger = require('./logger')
const uuid = require('uuid');
const bodyParser = require('body-parser')

let app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

let members = [{id: "1", name: 'David', email: 'david@gmail.com', status: 'active'}, {id: "2", name: 'Bob', email: 'bobbb@gmail.com', status: 'inactive'}];

app.use('/static', express.static(path.join(__dirname, 'public')));
app.use(logger)


app.get('/api/members', (req, res) => {
	res.json(members)
})
app.get('/api/members/:id', (req, res) => { // if the request is localhost:5000/api/members/5
	let requiredId = req.params.id; // "5"
	const found = members.find(member => member.id === requiredId);
	if (found) {
		res.json(found);
	} else {
		res.status(400).json({msg: 'NO member with ID of ' + requiredId});
	}
	
})

app.post('/api/members', (req, res) => {
	const newId = uuid.v4();
	const newMember = {id: newId, ...req.body};
	console.log(req.body)
	if(!newMember.name || !newMember.email) {
		res.status(400).json({msg: 'Please include name and email'});
	} else {
		members.push(newMember);
		res.json(members);
	}
});

app.delete('/api/members/:id', (req, res) => {
	const idToDelete = req.params.id;
	const indexToDelete = members.findIndex(m => m.id === idToDelete);
	if (indexToDelete < 0)  {
		res.status(400).json({msg: `no member with id ${idToDelete}`});
	} else {
		//const deletedMember = members[indexToDelete];
		const deletedMember = members.splice(indexToDelete, 1)[0];
		res.json(deletedMember);
	}
})

app.put('/api/members/:id', (req, res) => {
	const idToUpdate = req.params.id;
	const memberToUpdate = members.find(m => m.id === idToUpdate);
	if (memberToUpdate)
	{
		Object.assign(memberToUpdate, req.body);
		res.json(memberToUpdate);
	} else {
		res.status(400).json({msg: `no member with id ${idToUpdate}`});
	}
	
	//read the body from the request, and update only the specific attributes that were defined in the body.
	// For example if for id 2 we have body of {"name": "kuku"} then we only update the name of the member that has id === 2
	// and then return the specific member in the response
	
})




app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, 'public', 'index.html'));
})

app.get('/hello', (req, res) => {
	res.send("<h1>World</h1>");
});





const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
	console.log('server is up on port ' + PORT);
})
