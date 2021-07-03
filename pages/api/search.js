import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

export default function handler(req, res) {
  let posts

  if (process.env.NODE_ENV === 'production') {
    // @todo - fetch from cache
  } else {
    const files = fs.readdirSync(path.join('posts'))

    posts = files.map((fileName) => {
      const slug = fileName.replace('.md', '')

      const markdownWithMeta = fs.readFileSync(path.join('posts', fileName), 'utf-8')

      const { data: frontmatter } = matter(markdownWithMeta)

      return { slug, frontmatter }
    })
  }

  const results = posts.filter(
    ({ frontmatter: { title, excerpt, category } }) =>
      title.toLowerCase().indexOf(req.query.q) != -1 ||
      excerpt.toLowerCase().indexOf(req.query.q) != -1 ||
      category.toLowerCase().indexOf(req.query.q) != -1
  )

  console.log(results)

  res.status(200).json(JSON.stringify({ results }))
}