import "dotenv/config";
import app from "./app.js";
import mongoose from "mongoose";
import { MONGO_URL, PORT } from "./config/index.js";

const main = async () => {
  mongoose.set("strictQuery", false);
  mongoose.set("bufferCommands", false);
  await mongoose
    .connect(MONGO_URL)
    .then((res) => {
      console.log("DB CONNECTED");
    })
    .catch((err) => {
      console.log("DB NOT CONNECTED") ;
    });

  app.listen(PORT, () => console.log(`Server is Listining on PORT ${PORT}`));
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
