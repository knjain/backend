const { server } = require("./app");
const config = require("./configs/config");

const PORT = config.PORT;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});