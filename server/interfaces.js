/** 用户 */
export var User;
(function (User) {
    let UserStatus;
    (function (UserStatus) {
        UserStatus[UserStatus["ADMIN"] = 100] = "ADMIN";
        UserStatus[UserStatus["NORMAL"] = 1] = "NORMAL";
        UserStatus[UserStatus["DISABLED"] = 0] = "DISABLED";
    })(UserStatus = User.UserStatus || (User.UserStatus = {}));
    User.UserStatusMap = new Map([
        [UserStatus.ADMIN, '管理员'],
        [UserStatus.NORMAL, '普通用户'],
        [UserStatus.DISABLED, '已禁用']
    ]);
})(User || (User = {}));
