const listHelper = require('../utils/list_helper')
const listWithNoBlog = []

const listWithOneBlog = [
    {
      _id: 'Aa422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      __v: 0
    }
  ]

const listWithMultipleBlogs = [
    {
      _id: 'Ba422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful Really?',
      author: 'Some Author',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 7,
      __v: 0
    }, 
    {
        _id: 'Ca422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 4,
        __v: 0
    }, 
    {
        _id: 'Da422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 9,
        __v: 0
     }, 
    {
        _id: 'Ga422aa71b54a676234d17f8',
        title: 'Ok then',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 15,
        __v: 0
      },
    {
      _id: 'Ha422aa71b54a676234d17f8',
      title: 'But what will I find?',
      author: 'Who Is Real',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 2,
      __v: 0
    },
    {
      _id: 'Ia422aa71b54a676234d17f8',
      title: '... hello?',
      author: 'Jane Doe',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 12,
      __v: 0
    }, 
    {
        _id: 'Ia422aa71b54a676234d17f9',
        title: '... hello???',
        author: 'Jane Doe',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 10,
        __v: 0
      }, 
    {
        _id: 'Fa422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 1,
        __v: 0
    }, 
  ]

test('dummy returns one', () => {
  const blogs = []
  const result = listHelper.dummy(blogs)
  expect(result).toBe(1)
})

describe('sum of likes', () => {
    test('of empty list is zero', () => {
      const result = listHelper.totalLikes(listWithNoBlog)
      expect(result).toBe(0)
    })
  
    test('if only one post, its likes equals sum of likes', () => {
      const result = listHelper.totalLikes(listWithOneBlog)
      expect(result).toBe(5)
    })
  
    test('larger list is calculated correctly', () => {
      const result = listHelper.totalLikes(listWithMultipleBlogs)
      expect(result).toBe(60)
    })
  })

describe('max likes', () => {
    test('of empty list is null', () => {
        const result = listHelper.favoriteBlog(listWithNoBlog)
        expect(result).toBe(null)
    })

    test('if only one post, its max likes equals likes of blog post', () => {
        const result = listHelper.favoriteBlog(listWithOneBlog)
        expect(result.likes).toBe(5)
    })

    test('larger list is calculated correctly', () => {
        const result = listHelper.favoriteBlog(listWithMultipleBlogs)
        expect(result.likes).toBe(15)
    })
})

describe('most blogged author', () => {
    test('of empty list is null', () => {
        const result = listHelper.mostBlogs(listWithNoBlog)
        expect(result).toEqual(null)
    })

    test('of one post, is that post', () => {
        const result = listHelper.mostBlogs(listWithOneBlog)
        expect(result).toEqual(        {
            author: 'Edsger W. Dijkstra',
            blogs: 1
        })
    })

    test('of larger list is picked correctly', () => {
        const result = listHelper.mostBlogs(listWithMultipleBlogs)
        expect(result).toEqual({
            author: 'Edsger W. Dijkstra',
            blogs: 4
        })
    })
 })

 describe('most liked author', () => {
    test('of empty list is null', () => {
        const result = listHelper.mostLikes(listWithNoBlog)
        expect(result).toEqual(null)
    })

    test('of one post, is that author of that post', () => {
        const result = listHelper.mostLikes(listWithOneBlog)
        expect(result).toEqual({
            author: 'Edsger W. Dijkstra',
            likes: 5
        })
    })

    test('of larger list is picked correctly', () => {
        const result = listHelper.mostLikes(listWithMultipleBlogs)
        expect(result).toEqual({
            author: 'Edsger W. Dijkstra',
            likes: 29
        })
    })
 })


 