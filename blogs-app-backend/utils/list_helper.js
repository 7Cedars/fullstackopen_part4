const dummy = (blogs) => {
  const Blogs = 1

  return Blogs 
}

const totalLikes = (blogs) => {

  const summingLikes = (sum, blog) => {
    return sum + blog.likes
  }

  return blogs.length === 0
  ? 0
  : blogs.reduce(summingLikes, 0) 
}

const favoriteBlog  = (blogs) => {

  const maxLikes = (max, blog) => {
    return Math.max(max, blog.likes)
  }

  const maxLiked = blogs.reduce(maxLikes, 0) 
  const favBlog = blogs.find(blog => blog.likes === maxLiked)

  return blogs.length === 0
  ? null
  : {
      title: favBlog.title, 
      author: favBlog.author, 
      likes: favBlog.likes, 
    }
}

module.exports = {
  dummy, totalLikes, favoriteBlog
}