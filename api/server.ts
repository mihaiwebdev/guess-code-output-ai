import dotenv from "dotenv";
import express, { Express } from "express";
import path from "path";
dotenv.config();
const cors = require("cors");
const rateLimit = require("express-rate-limit");

const port = process.env.PORT || 8080;

// Route files
const codeSnippet = require("./routes/code-snippet-routes");

const app: Express = express();

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Enable cors
const corsOptions = {
  origin: [
    "https://ai-guess-code-output-production.up.railway.app/",
    "http://localhost:4200",
  ],
  methods: "GET,POST",
};
app.use(cors(corsOptions));

// Requests limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 50,
});
app.use(limiter);

//  Mount Routers
app.use("/api/code-snippet", codeSnippet);

// Serve Client
if (process.env.NODE_ENV === "production") {
  const __dirname = path.resolve();
  app.use(express.static(path.join(__dirname, "client/dist/client/browser")));
  app.get("*", (req, res) =>
    res.sendFile(
      path.resolve(
        __dirname,
        "client",
        "dist",
        "client",
        "browser",
        "index.html"
      )
    )
  );
}

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
