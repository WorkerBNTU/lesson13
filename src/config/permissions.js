const ROLES = {
    ADMIN: "ADMIN",
    MODERATOR: "MODERATOR",
    USER: "USER"
}

const PERMISSIONS = {
    // Посты
    "read:posts": [ROLES.USER, ROLES.MODERATOR, ROLES.ADMIN],
    "create:posts": [ROLES.USER, ROLES.MODERATOR, ROLES.ADMIN],
    "update:own:posts": [ROLES.USER, ROLES.MODERATOR, ROLES.ADMIN],
    "update:any:posts": [ROLES.MODERATOR, ROLES.ADMIN],
    "delete:own:posts": [ROLES.USER, ROLES.MODERATOR, ROLES.ADMIN],
    "delete:any:posts": [ROLES.MODERATOR, ROLES.ADMIN],
    "publish:posts": [ROLES.MODERATOR, ROLES.ADMIN],

    // Пользователи
    "read:users": [ROLES.MODERATOR, ROLES.ADMIN],
    "read:profile": [ROLES.USER, ROLES.MODERATOR, ROLES.ADMIN],
    "update:own:profile": [ROLES.USER, ROLES.MODERATOR, ROLES.ADMIN],
    "update:any:profile": [ROLES.ADMIN],
    "update:any:user": [ROLES.ADMIN],
    "delete:any:user": [ROLES.ADMIN],

    // Комментарии
    "create:comments": [ROLES.USER, ROLES.MODERATOR, ROLES.ADMIN],
    "delete:own:comments": [ROLES.USER, ROLES.MODERATOR, ROLES.ADMIN],
    "delete:any:comments": [ROLES.MODERATOR, ROLES.ADMIN],

}

function hasPermission(role, permission) {
    const roles = PERMISSIONS[permission] || [];
    return roles.includes(role)
}

// function getRolePermissions(role) {
    
// }

module.exports = { hasPermission }