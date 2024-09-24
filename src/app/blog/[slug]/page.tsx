import { client } from '@/sanity/lib/client';
import { urlFor } from '@/sanity/lib/image';
import { groq } from 'next-sanity';
import Image from 'next/image';
import Link from 'next/link';
import { PortableText } from '@portabletext/react';
import Navbar from '@/components/global/navbar';
import Footer from '@/components/global/footer';

interface PostParams {
  params: { slug: string };
}

interface Post {
  title: string;
  mainImage: any;
  body: any;
  author: { name: string; image: any };
  publishedAt: string;
}

const query = groq`
  *[_type == "post" && slug.current == $slug][0] {
    title,
    mainImage,
    body,
    author->{name, image},
    publishedAt
  }
`;

export default async function BlogPost({ params }: PostParams) {
  const post = await client.fetch<Post>(query, { slug: params.slug });

  if (!post) {
    return <div>Post not found</div>;
  }

  return (
    <>
      <Navbar />
      <article className="mx-auto max-w-[50rem] px-6 mt-12 py-12">
        <Link href="/blog" className="text-gray-600 hover:text-zinc-900 transition-colors mb-8 inline-block">
          ← Back to Blog
        </Link>
        <h1 className="text-5xl font-bold mb-6">{post.title}</h1>
        <div className="flex items-center mb-8">
          {post.author.image && (
            <Image
              src={urlFor(post.author.image).width(100).height(100).url()}
              alt={post.author.name}
              width={100}
              height={100}
              className="rounded-full border-2 border-black mr-4"
            />
          )}
          
          <div>
            <p className="font-semibold">{post.author.name}</p>
            <p className="text-gray-600 text-sm">
              {new Date(post.publishedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
        </div>
        {post.mainImage && (
          <div className="aspect-[16/9] relative mb-12 h-[400px] md:h-[400px]"> {/* Increased height */}
            <Image
              src={urlFor(post.mainImage).width(1200).height(690).url()} // Increased image size
              alt={post.title}
              fill
              className="object-cover rounded-lg border-2 border-gray-200" // Added border
            />
          </div>
        )}
        <div className="prose prose-lg max-w-none">
          <PortableText value={post.body} />
        </div>
       
      </article>
      <Footer />
    </>
  );
}