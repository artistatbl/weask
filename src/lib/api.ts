import { createClient } from '@sanity/client'

const client = createClient({
  projectId: 'your-project-id',
  dataset: 'production',
  useCdn: true, // set to `false` to bypass the edge cache
  apiVersion: '2023-05-03', // use current date (YYYY-MM-DD) to target the latest API version
})

export async function fetchBlogPosts() {
  return client.fetch(`*[_type == "post"] | order(publishedAt desc) {
    _id,
    title,
    subtitle,
    "thumbnailUrl": mainImage.asset->url
  }`)
}

export async function fetchBlogPost(id: string) {
  return client.fetch(`*[_type == "post" && _id == $id][0]`, { id })
}