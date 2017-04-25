var UsersHelper = {};

UsersHelper.usersPath = () => `/users`;
UsersHelper.userPath = id => `/user/${id}`;
UsersHelper.editUserPath = id => `/user/${id}/edit`;
module.exports = UsersHelper;
