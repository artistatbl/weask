import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get('url');
  
  if (!url) {
    return NextResponse.json({ error: 'URL parameter is required' }, { status: 400 });
  }

  try {
    const response = await fetch(url, { 
      method: 'HEAD',
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; WebPreviewBot/1.0; +http://example.com/bot)'
      }
    });
    
    const xFrameOptions = response.headers.get('X-Frame-Options');
    const contentSecurityPolicy = response.headers.get('Content-Security-Policy');

    let embeddable = true;
    let message = 'Website can be embedded';

    if (xFrameOptions && xFrameOptions.toUpperCase() === 'DENY') {
      embeddable = false;
      message = `Website cannot be embedded due to X-Frame-Options: ${xFrameOptions}`;
    } else if (contentSecurityPolicy && contentSecurityPolicy.includes("frame-ancestors 'none'")) {
      embeddable = false;
      message = 'Website cannot be embedded due to Content Security Policy';
    }

    return NextResponse.json({ embeddable, message });
  } catch (error) {
    // If there's an error, we'll assume the website can be embedded
    return NextResponse.json({ embeddable: true, message: 'Assuming website can be embedded' });
  }
}