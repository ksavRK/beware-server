const express = require("express");
const cors = require("cors");

const db = require("./app/models");
const dbConfig = require("./app/config/db.config");
const Role = db.role;

const app = express();

var corsOptions = {
  origin: "http://localhost:8081",
};

const main = async () => {
  try {
    await db.mongoose.connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Successfully connect to MongoDB.");
    initial();
  } catch (err) {
    console.error("Connection error", err);
    process.exit();
  }
};

main();

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// routes
require("./app/routes/auth.routes")(app);
require("./app/routes/user.routes")(app);
require("./app/routes/cause.routes")(app);

const initial = async () => {
  try {
    const count = await Role.estimatedDocumentCount();
    if (count === 0) {
      await Promise.all([new Role({ name: "user" }).save(), new Role({ name: "business_owner" }).save()]);
      console.log("Added 'user' and 'business_owner' to roles collection.");
    }
  } catch (err) {
    console.error("Error initializing roles:", err);
  }
};

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to beware." });
});

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
