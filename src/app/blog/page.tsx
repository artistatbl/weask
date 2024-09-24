import { client } from '@/sanity/lib/client';
import { urlFor } from '@/sanity/lib/image';
import { groq } from 'next-sanity';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/global/navbar';
import Footer from '@/components/global/footer';

// Define the type for our blog post
interface Post {
  _id: string;
  title: string;
  slug: { current: string };
  publishedAt: string;
  mainImage: any;
  excerpt: string;
  author: { name: string; image: any };
}

// Query to fetch all blog posts
const query = groq`
  *[_type == "post"] | order(publishedAt desc) {
    _id,
    title,
    slug,
    publishedAt,
    mainImage,
    excerpt,
    "author": author->{name, image}
  }
`;

export default async function BlogPage() {
  const posts = await client.fetch<Post[]>(query);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow pt-16"> {/* Added pt-16 for navbar height */}
        <div className="h-full flex flex-col items-center justify-start p-4">
          <h1 className="text-3xl font-bold mb-4 text-center">Our Blog</h1>
          <div className="w-full max-w-7xl overflow-y-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2  lg:grid-cols-3 gap-4">
              {posts.map((post) => (
                <Link href={`/blog/${post.slug.current}`} key={post._id} className="group">
                  <div className="bg-white rounded-lg border-2 border-gray-600 shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
                    {post.mainImage && (
                      <Image
                        src={urlFor(post.mainImage).width(400).height(200).url()}
                        alt={post.title}
                        width={400}
                        height={200}
                        className="w-full h-32  object-cover"
                      />
                    )}
                    <div className="p-3 flex-grow flex flex-col">
                      <p className="text-gray-600 text-xs mb-1">
                        {new Date(post.publishedAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </p>
                      <h2 className="text-lg font-semibold mb-1 group-hover:text-blue-600 transition-colors">
                        {post.title}
                      </h2>
                      <p className="text-gray-700 text-sm line-clamp-2 flex-grow">{post.excerpt}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
