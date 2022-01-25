const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;
const port = process.env.PORT || PORT;

app.use(express.static(path.join(__dirname + '/dist')));

app.listen(port, () => {
	console.log(`Chat App server started on port ${port}!`);
});
