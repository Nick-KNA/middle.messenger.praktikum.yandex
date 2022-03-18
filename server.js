const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;
const port = process.env.PORT || PORT;
const targetPath = path.join(__dirname + '/dist');

app.use(express.static(targetPath));

app.use((request, response) => {
	response.sendFile(path.resolve(`${targetPath}/index.html`));
});

app.listen(port, () => {
	console.log(`Chat App server started on port ${port}!`);
});
