export const account = {
  login: { method: 'POST', url: '/api/login' },
  logout: { method: 'POST', url: '/api/logout' },
  register: { method: 'POST', url: '/api/register' },
}

export const adminBlog = {
  deleteBlog: { method: 'DELETE', url: '/api/admin/blog/:id' },
  getBlogList: { method: 'GET', url: '/api/admin/blog' },
  updateBlog: { method: 'PUT', url: '/api/admin/blog/:id' },
}

export const adminBookmark = {
  deleteBookmark: { method: 'DELETE', url: '/api/admin/bookmark/:id' },
  getBookmarkList: { method: 'GET', url: '/api/admin/bookmark' },
}

export const adminStatistics = {
  getBlogTags: { method: 'GET', url: '/api/admin/statistics/blogTag' },
  getBlogTime: { method: 'GET', url: '/api/admin/statistics/blogTime' },
  getBlogWords: { method: 'GET', url: '/api/admin/statistics/blogWords' },
  getTodo: { method: 'GET', url: '/api/admin/statistics/todo' },
  statistic: { method: 'GET', url: '/api/admin/statistics/count' },
  userActive: { method: 'GET', url: '/api/admin/statistics/userActive' },
}

export const adminTodo = {
  deleteTodo: { method: 'DELETE', url: '/api/admin/todo/:id' },
  getTodoList: { method: 'GET', url: '/api/admin/todo' },
  updateTodo: { method: 'PUT', url: '/api/admin/todo/:id' },
}

export const adminUser = {
  createUser: { method: 'POST', url: '/api/admin/user' },
  deleteUser: { method: 'DELETE', url: '/api/admin/user/:id' },
  getUserList: { method: 'GET', url: '/api/admin/user' },
  updateUser: { method: 'PUT', url: '/api/admin/user/:id' },
}

export const blog = {
  createBlog: { method: 'POST', url: '/api/blog' },
  deleteBlog: { method: 'DELETE', url: '/api/blog/:id' },
  exportBlog: { method: 'POST', url: '/api/blog/export' },
  getBlogById: { method: 'GET', url: '/api/blog/:id' },
  getBlogCatalog: { method: 'GET', url: '/api/blog/catalog' },
  getBlogs: { method: 'GET', url: '/api/blog' },
  updateBlog: { method: 'PUT', url: '/api/blog/:id' },
}

export const bookmark = {
  createBookmark: { method: 'POST', url: '/api/bookmark' },
  deleteBoolmark: { method: 'DELETE', url: '/api/bookmark/:id' },
  getMyBookmarks: { method: 'GET', url: '/api/bookmark' },
  getMyFavBookmarks: { method: 'GET', url: '/api/bookmark/favorite' },
  updateBookmark: { method: 'PUT', url: '/api/bookmark/:id' },
}

export const docIndex = {
  getDocIndex: { method: 'GET', url: '/api/docIndex/:type' },
  putDocIndex: { method: 'PUT', url: '/api/docIndex/:type' },
}

export const file = {
  getFile: { method: 'GET', url: '/api/file/blob/:fileName' },
  saveFile: { method: 'POST', url: '/api/file/blob' },
}

export const information = { getNews: { method: 'GET', url: '/api/tops/:type' } }

export const myProfile = {
  getMyProfile: { method: 'GET', url: '/api/myProfile' },
  updateMyProfile: { method: 'PUT', url: '/api/myProfile' },
}

export const statistics = {
  getBlogTags: { method: 'GET', url: '/api/statistics/blogTag' },
  getBlogTime: { method: 'GET', url: '/api/statistics/blogTime' },
  getBlogWords: { method: 'GET', url: '/api/statistics/blogWords' },
  getTodo: { method: 'GET', url: '/api/statistics/todo' },
}

export const todo = {
  createTodo: { method: 'POST', url: '/api/todo' },
  deleteTodo: { method: 'DELETE', url: '/api/todo/:id' },
  getTodoList: { method: 'GET', url: '/api/todo' },
  updateTodo: { method: 'PUT', url: '/api/todo/:id' },
}

export const tourist = {
  getBlogArchives: { method: 'GET', url: '/api/tourist/:name/archives' },
  getBlogById: { method: 'GET', url: '/api/tourist/:name/blog/:id' },
  getBlogCatalog: { method: 'GET', url: '/api/tourist/:name/catalog' },
  getBlogs: { method: 'GET', url: '/api/tourist/:name/blog' },
  getBlogTags: { method: 'GET', url: '/api/tourist/:name/tags' },
  getProfile: { method: 'GET', url: '/api/tourist/:name/profile' },
}
