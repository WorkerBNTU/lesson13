const config = require("./config/index");
const express = require("express");
const authRouter = require("./routes/auth");
const cookieParser = require("cookie-parser");
const { authenticate, authorize } = require("./middleware/auth");
const {
  requirePermission,
  requirePostOwnership,
  requireOwnership
} = require("./middleware/rbac");

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use("/auth", authRouter);

app.delete(
  "/posts/:id",
  authenticate,
  requirePermission("delete:own:posts"),
  requirePostOwnership(["ADMIN", "MODERATOR"]),
  (req, res) => {
    res.json({
      message:
        "Да, вы удалили, потому что у вас есть delete:any:posts (хотя я и не знаю даже, какой вы роли и это неважно)",
    });
  },
);

const commentModel = "тут типа модель призмы"
app.delete("/comment/:id",
    authenticate,
    requirePermission("delete:own:comment"),
    requireOwnership(commentModel, "id", "authorId", ["MODERATOR", "ADMIN"]),
    (req, res) => {
        res.json({
            message: "Сделано"
        })
    }
)

app.update("/comment/:id",
    authenticate,
    requirePermission("update:own:comment"),
    requireOwnership(commentModel, "id", "authorId"),
    (req, res) => {
        res.json({
            message: "Сделано"
        })
    }
)

const postModel = "тут типа модель призмы"
app.update("/post/:id",
    authenticate,
    requirePermission("post:own:comment"),
    requireOwnership(postModel, "id", "userId", ["MODERATOR", "ADMIN"]),
    (req, res) => {
        res.json({
            message: "Сделано"
        })
    }
)


app.listen(config.port);
