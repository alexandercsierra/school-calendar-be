if (process.env.NODE_ENV !== "production") {
	require("dotenv").config();
}

server = require("./api/server");

const port = process.env.PORT || 4000;

server.listen(port, () => {
	console.log(`\n *** Server listening on port ${port} *** \n`);
});
