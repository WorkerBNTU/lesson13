const { Router } = require("express");
const bcrypt = require("bcryptjs");
const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} = require("../utils/jwt");
const { authenticate } = require("../middleware/auth");

const router = Router();

const users = [
  {
    id: 0,
    email: "admin",
    password: bcrypt.hashSync("admin", 12),
    role: "ADMIN",
  },
  {
    id: 1,
    email: "user",
    password: bcrypt.hashSync("user", 12),
    role: "USER",
  },
  {
    id: 2,
    email: "moderator",
    password: bcrypt.hashSync("moderator", 12),
    role: "MODERATOR",
  },
  {
    id: 3,
    email: "user3",
    password: bcrypt.hashSync("user3", 12),
    role: "USER",
  },
];

let nextId = 4;

router.post("/register", async (req, res) => {
  const { email, password } = req.body;

  // сделали вид, что тут куча валидации средствами ORM

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = {
    id: nextId++,
    email: email,
    password: hashedPassword,
    role: "user",
  };

  users.push(user);
  console.log(users);

  return res.status(201).json({
    message: "success",
    user: user,
  });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = users.find((u) => u.email == email);

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: "Неверные учётные данные" });
  }

  const userWithoutPass = {
    id: user.id,
    email: user.email,
    role: user.role,
  };

  const accessToken = generateAccessToken(userWithoutPass);
  const refreshToken = generateRefreshToken({ id: user.id });

  res
    .cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      secure: process.env.NODE_ENV === "production",
    })
    .json({
      user: userWithoutPass,
      accessToken,
    });
});

router.post("/refresh", (req, res) => {
  let refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ error: "Refresh token отсутствует" });
  }

  try {
    const payload = verifyRefreshToken(refreshToken);
    const user = users.find((u) => u.id == payload.id);
    if (!user) {
      return res.status(401).json({ error: "Пользователь не найден" });
    }

    const userWithoutPass = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = generateAccessToken(userWithoutPass);
    refreshToken = generateRefreshToken({ id: user.id });

    res
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
        secure: process.env.NODE_ENV === "production",
      })
      .json({
        accessToken,
      });
  } catch (err) {
    console.log(err);
    return res.status(401).json({ error: "Токен невалид" });
  }
});

router.post("/logout", (req, res) => {
  res.clearCookie("refreshToken");
  res.json({ message: "Выход выполнен" });
});

router.get("/me", authenticate, (req, res) => {
  res.json({
    message: "Сюда можно попасть только авторизованным пользователям",
    userEmail: req.user.email,
  });
});

module.exports = router;
