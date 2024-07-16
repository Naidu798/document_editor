const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectSocket = require("./socket");

require("dotenv").config();

const authRouter = require("./routes/authRoutes");
const docsRouter = require("./routes/documentRoutes");
const userRouter = require("./routes/userRoutes");

const connectDB = require("./config/db");

const PORT = process.env.PORT || 5000;

const app = express();
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/doc", docsRouter);
app.use("/api/user", userRouter);

const server = app.listen(PORT, async () => {
  try {
    await connectDB();
    console.log("Connected to DB");
    console.log(`Server running on port ${PORT}`);
  } catch (err) {
    console.log(err);
  }
});

connectSocket(server);
