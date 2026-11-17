require("dotenv").config()

module.exports = {
    jwt: {
        accessSecret: process.env.JWT_ACCESS_SECRET,
        refreshSecret: process.env.JWT_REFRESH_SECRET,
        accessExpiresIn: "15m",
        refreshExpiresIn: "7d"
    },
    port: process.env.PORT
}