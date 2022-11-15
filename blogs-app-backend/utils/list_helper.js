const dummy = (blogs) => {
  const Blogs = 1

  return Blogs 
}

const totalLikes = (blogs) => {

  const reducer = (sum, item) => {
    item = blogs.likes 
    return sum + item
  }

  return blogs.length === 0
  ? 0
  : blogs.reduce(reducer, 0) 
}

module.exports = {
  dummy, totalLikes
}