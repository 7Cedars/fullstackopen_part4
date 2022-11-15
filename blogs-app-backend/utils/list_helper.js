lodash = require('lodash');

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

const mostBlogs  = (blogs) => {

  if (blogs.length === 0) { return null } 

  const authorsArray = blogs.map(blog => blog.author) 
  // const test = lodash.group(authorsArray, length)

  const authorsRanked = authorsArray.reduce(function (accumulated, current) {
    return accumulated[current] ? 
              ++accumulated[current] 
              : 
              accumulated[current] = 1, accumulated
    }, {});

  const maxAuthor = Object.keys(authorsRanked).reduce((a, b) => authorsRanked[a] > authorsRanked[b] ? a : b) 

  return { 
      author: maxAuthor, 
      blogs: authorsRanked[maxAuthor]
    } 
}


const mostLikes  = (blogs) => {

  if (blogs.length === 0) { return null } 

  const authorsRanked = blogs.reduce(function (accLikesAuthor, currentBlog) {
    return accLikesAuthor[currentBlog.author] ? 
              accLikesAuthor[currentBlog.author] = (accLikesAuthor[currentBlog.author] + currentBlog.likes)
              : 
              accLikesAuthor[currentBlog.author] = currentBlog.likes, accLikesAuthor
    }, {});

  const maxAuthor = Object.keys(authorsRanked).reduce((a, b) => authorsRanked[a] > authorsRanked[b] ? a : b) 

  return { 
    author: maxAuthor, 
    likes: authorsRanked[maxAuthor]
  } 
}

module.exports = {
  dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes
}