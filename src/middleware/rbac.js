const { hasPermission } = require("../config/permissions");

function requirePermission(permission) {
    return (req, res, next) => {
        if (!hasPermission(req.user.role, permission)) {
            return res.status(403).json({
                error: "Недостаточно прав"
            })
        }

        next()
    }
}

function requirePostOwnership(allowedRoles) {
    return (req, res, next) => {
        if (allowedRoles.includes(req.user.role)) {
            return next()
        }

        const postId = req.params.id;

        // типа нашёл пост в призме по postId
        const post = {
            title: "Баламбалам",
            authorId: 1
        }

        if (post.authorId !== req.user.id) {
            return res.status(403).json({
                error: "Это не ваш пост"
            })
        }

        next()
    }
}

// универсальная замена функции requirePostOwnership (не только для постов)
function requireOwnership(model, resourceKey, ownerField, allowedRoles = ["ADMIN"]) {
    // model - модель призмы, мы её использовать щас не будет, а лишь делать вид
    // resourceKey - имя path-параметра в req.params
    // ownerField - имя поля для поиска в модели
    return (req, res, next) => {
        if (allowedRoles.includes(req.user.role)) {
            return next()
        }

        const resourceId = req.params[resourceKey]; // id -> req.params["id"] -> 123
        // тут типа поиск по модели await prisma[model].findUnique({where: resourceId})
        const resource = {
            name: "Какой-то ресурс. Может пост, может коммент, может юзер",
            [ownerField]: 1 // не факт, что такое, там может быть любое поле (userId, authorId ...)
        }

        if (resource[ownerField] !== req.user.id) {
            return res.status(403).json({
                error: "Это не ваш ресурс"
            })
        }

        next()
    }


}

module.exports = { requirePermission, requirePostOwnership, requireOwnership }