import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url');

  if (!url) {
    return NextResponse.json({ error: 'URL is required' }, { status: 400 });
  }

  try {
    const isEmbeddable = await checkEmbeddability(url);
    return NextResponse.json({ isEmbeddable });
  } catch (error) {
    console.error('Error checking embeddability:', error);
    return NextResponse.json({ error: 'Failed to check embeddability' }, { status: 500 });
  }
}

async function checkEmbeddability(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { 
      method: 'HEAD',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    const contentType = response.headers.get('content-type');
    
    if (contentType && contentType.includes('text/html')) {
      const xFrameOptions = response.headers.get('x-frame-options');
      const contentSecurityPolicy = response.headers.get('content-security-policy');
      
      if (!xFrameOptions && !contentSecurityPolicy) {
        return true;
      }
      
      if (xFrameOptions) {
        const xfoLower = xFrameOptions.toLowerCase();
        if (xfoLower === 'deny' || xfoLower === 'sameorigin') {
          return false;
        }
      }
      
      if (contentSecurityPolicy) {
        const cspLower = contentSecurityPolicy.toLowerCase();
        if (cspLower.includes('frame-ancestors') && !cspLower.includes('frame-ancestors *')) {
          return false;
        }
      }
      
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error during embeddability check:', error);
    return false;
  }
}
