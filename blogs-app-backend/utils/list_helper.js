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

module.exports = {
  dummy, totalLikes
}