const Blog = require('../models/blog')

const firstBlogs = [
  {
    title: "My first saved blog",
    author: "Jane Doe",
    url: "BlogsFromJaneDoe.org/43527845278",
    likes: 4
  },
  {
    title: "My second saved blog",
    author: "John Doe",
    url: "BlogsFromJohnDoe.org/a67324g",
    likes: 4
  },
  {
    title: "My third saved blog",
    author: "Else, Someon",
    url: "BlogsFromTheVoid.org/00000",
    likes: 4
  }
]

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

module.exports = {
    firstBlogs, blogsInDb
}