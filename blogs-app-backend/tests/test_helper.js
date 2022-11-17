const Blog = require('../models/blog')
const User = require('../models/user')

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

const stockUsers = [
  {
    username: "root",
    name: "Superuser",
    password: "9043nkjfb382"
  },
  {
    username: "AdaL",
    name: "Ada Lovelace",
    password: "324nmv3r90328"
  },
  {
    username: "NewUser",
    name: "User New",
    password: "3ewqwqe28"
  }
]

const nonExistingId = async () => {
  const blog = new Blog( {
    title: "This will be deleted",
    author: "No one",
    url: "0000",
    likes: 0
  })
  await blog.save()
  await blog.remove()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}

module.exports = {
    firstBlogs,
    stockUsers, 
    blogsInDb, 
    nonExistingId,
    usersInDb, 
}