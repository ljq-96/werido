export const adminUser = {"getUserList":"/api/admin/user","createUser":"/api/admin/user","updateUser":"/api/admin/user/:id","deleteUser":"/api/admin/user/:id"}

export const myProfile = {"getMyProfile":"/api/myProfile","updateMyProfile":"/api/myProfile"}

export const adminTodo = {"getTodoList":"/api/admin/todo","updateTodo":"/api/admin/todo/:id","deleteTodo":"/api/admin/todo/:id"}

export const todo = {"getTodoList":"/api/todo","createTodo":"/api/todo","updateTodo":"/api/todo/:id","deleteTodo":"/api/todo/:id"}

export const tourist = {"getProfile":"/api/tourist/:name/profile","getBlogs":"/api/tourist/:name/blog","getBlogById":"/api/tourist/:name/blog/:id","getBlogCatalog":"/api/tourist/:name/catalog","getBlogTags":"/api/tourist/:name/tags","getBlogArchives":"/api/tourist/:name/archives"}

export const adminStatistics = {"userActive":"/api/admin/statistics/userActive","statistic":"/api/admin/statistics/count","getBlogTime":"/api/admin/statistics/blogTime","getBlogWords":"/api/admin/statistics/blogWords","getTodo":"/api/admin/statistics/todo","getBlogTags":"/api/admin/statistics/blogTag"}

export const statistics = {"getBlogTags":"/api/statistics/blogTag","getBlogTime":"/api/statistics/blogTime","getBlogWords":"/api/statistics/blogWords","getTodo":"/api/statistics/todo"}

export const information = {"getNews":"/api/tops/:type"}

export const file = {"getFile":"/api/file/blob/:fileName","saveFile":"/api/file/blob"}

export const docIndex = {"getDocIndex":"/api/docIndex/:type","putDocIndex":"/api/docIndex/:type"}

export const adminBookmark = {"getBookmarkList":"/api/admin/bookmark","deleteBookmark":"/api/admin/bookmark/:id"}

export const bookmark = {"getMyBookmarks":"/api/bookmark","getMyFavBookmarks":"/api/bookmark/favorite","updateBookmark":"/api/bookmark/:id","createBookmark":"/api/bookmark","deleteBoolmark":"/api/bookmark/:id"}

export const adminBlog = {"getBlogList":"/api/admin/blog","updateBlog":"/api/admin/blog/:id","deleteBlog":"/api/admin/blog/:id"}

export const blog = {"getBlogs":"/api/blog","getBlogCatalog":"/api/blog/catalog","getBlogById":"/api/blog/:id","createBlog":"/api/blog","updateBlog":"/api/blog/:id","deleteBlog":"/api/blog/:id","exportBlog":"/api/blog/export"}

export const account = {"login":"/api/login","register":"/api/register","logout":"/api/logout"}

