export const tourist = {
  getProfile: { method: 'GET', url: '/api/tourist/:name/profile' },
  getBlogs: { method: 'GET', url: '/api/tourist/:name/blog' },
  getBlogById: { method: 'GET', url: '/api/tourist/:name/blog/:id' },
  getBlogCatalog: { method: 'GET', url: '/api/tourist/:name/catalog' },
  getBlogTags: { method: 'GET', url: '/api/tourist/:name/tags' },
  getBlogArchives: { method: 'GET', url: '/api/tourist/:name/archives' },
}

export const adminUser = {
  getUserList: { method: 'GET', url: '/api/admin/user' },
  createUser: { method: 'POST', url: '/api/admin/user' },
  updateUser: { method: 'PUT', url: '/api/admin/user/:id' },
  deleteUser: { method: 'DELETE', url: '/api/admin/user/:id' },
}

export const myProfile = {
  getMyProfile: { method: 'GET', url: '/api/myProfile' },
  updateMyProfile: { method: 'PUT', url: '/api/myProfile' },
}

export const adminTodo = {
  getTodoList: { method: 'GET', url: '/api/admin/todo' },
  updateTodo: { method: 'PUT', url: '/api/admin/todo/:id' },
  deleteTodo: { method: 'DELETE', url: '/api/admin/todo/:id' },
}

export const todo = {
  getTodoList: { method: 'GET', url: '/api/todo' },
  createTodo: { method: 'POST', url: '/api/todo' },
  updateTodo: { method: 'PUT', url: '/api/todo/:id' },
  deleteTodo: { method: 'DELETE', url: '/api/todo/:id' },
}

export const adminStatistics = {
  userActive: { method: 'GET', url: '/api/admin/statistics/userActive' },
  statistic: { method: 'GET', url: '/api/admin/statistics/count' },
  getBlogTime: { method: 'GET', url: '/api/admin/statistics/blogTime' },
  getBlogWords: { method: 'GET', url: '/api/admin/statistics/blogWords' },
  getTodo: { method: 'GET', url: '/api/admin/statistics/todo' },
  getBlogTags: { method: 'GET', url: '/api/admin/statistics/blogTag' },
}

export const statistics = {
  getBlogTags: { method: 'GET', url: '/api/statistics/blogTag' },
  getBlogTime: { method: 'GET', url: '/api/statistics/blogTime' },
  getBlogWords: { method: 'GET', url: '/api/statistics/blogWords' },
  getTodo: { method: 'GET', url: '/api/statistics/todo' },
}

export const information = { getNews: { method: 'GET', url: '/api/tops/:type' } }

export const file = {
  getFile: { method: 'GET', url: '/api/file/blob/:fileName' },
  saveFile: { method: 'POST', url: '/api/file/blob' },
}

export const docIndex = {
  getDocIndex: { method: 'GET', url: '/api/docIndex/:type' },
  putDocIndex: { method: 'PUT', url: '/api/docIndex/:type' },
}

export const adminBookmark = {
  getBookmarkList: { method: 'GET', url: '/api/admin/bookmark' },
  deleteBookmark: { method: 'DELETE', url: '/api/admin/bookmark/:id' },
}

export const bookmark = {
  getMyBookmarks: { method: 'GET', url: '/api/bookmark' },
  getMyFavBookmarks: { method: 'GET', url: '/api/bookmark/favorite' },
  updateBookmark: { method: 'PUT', url: '/api/bookmark/:id' },
  createBookmark: { method: 'POST', url: '/api/bookmark' },
  deleteBoolmark: { method: 'DELETE', url: '/api/bookmark/:id' },
}

export const adminBlog = {
  getBlogList: { method: 'GET', url: '/api/admin/blog' },
  updateBlog: { method: 'PUT', url: '/api/admin/blog/:id' },
  deleteBlog: { method: 'DELETE', url: '/api/admin/blog/:id' },
}

export const blog = {
  getBlogs: { method: 'GET', url: '/api/blog' },
  getBlogCatalog: { method: 'GET', url: '/api/blog/catalog' },
  getBlogById: { method: 'GET', url: '/api/blog/:id' },
  createBlog: { method: 'POST', url: '/api/blog' },
  updateBlog: { method: 'PUT', url: '/api/blog/:id' },
  deleteBlog: { method: 'DELETE', url: '/api/blog/:id' },
  exportBlog: { method: 'POST', url: '/api/blog/export' },
}

export const account = {
  login: { method: 'POST', url: '/api/login' },
  register: { method: 'POST', url: '/api/register' },
  logout: { method: 'POST', url: '/api/logout' },
}
