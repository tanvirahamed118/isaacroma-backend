require("dotenv").config();
const app = require("./app");
const port = process.env.PORT || 4002;
const http = require("http");
const server = http.createServer(app);

server.listen(port, () => {
  console.log(`app is running at http://localhost:${port}`);
});
