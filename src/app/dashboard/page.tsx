// app/dashboard/page.tsx
import DashWrapper from "@/components/DashWapper"
import { prisma } from "@/lib/db"
import { getUserSubscription } from '../actions/user'
import { serializeSubscription } from '@/utils/serializeSubscription'
import { onLoginUser } from '../actions/auth'


interface RecentUrl {
  id: string;
  url: string;
  title: string;
  visitedAt: Date;
}

function generateUrlTitle(url: string): string {
  try {
    const urlObj = new URL(url);
    const hostParts = urlObj.hostname.split('.');
    const domain = hostParts.length > 1 ? hostParts[hostParts.length - 2] : hostParts[0];
    const pathSegments = urlObj.pathname.split('/').filter(Boolean);
    
    const prefix = domain.slice(0, 3).toUpperCase();
    
    let content = '';
    if (pathSegments.length > 0) {
      content = pathSegments[pathSegments.length - 1]
        .replace(/[-_]/g, ' ')
        .replace(/\.[^/.]+$/, '')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
    }
    
    const title = content ? `${prefix}: ${content}` : prefix;
    return title.length > 30 ? title.substring(0, 27) + '...' : title;
  } catch (error) {
    console.error("Error generating URL title:", error);
    return url.substring(0, 30);
  }
}

const DashboardPage = async () => {
  const loginResult = await onLoginUser();
 

  if (!loginResult.user) {
    throw new Error("User authentication failed");
  }

  // Get user subscription
//   let subscription;
//   try {
//     subscription = await getUserSubscription();
//   } catch (error) {
//     console.error("Error fetching subscription:", error);
//     subscription = null;
//   }
const subscription = await getUserSubscription()
  const serializedSubscription = subscription ? serializeSubscription(subscription) : null

  const recentSearchHistories = await prisma.searchHistory.findMany({
    where: { userId: loginResult.user.id },
    orderBy: { createdAt: 'desc' },
    take: 20,
    select: {
      id: true,
      domain: true,
      createdAt: true,
    },
  });

  const normalizedUrls = new Map<string, RecentUrl>();
  recentSearchHistories.forEach(history => {
    const normalizedUrl = new URL(history.domain).toString();
    if (!normalizedUrls.has(normalizedUrl)) {
      normalizedUrls.set(normalizedUrl, {
        id: history.id,
        url: normalizedUrl,
        title: generateUrlTitle(normalizedUrl),
        visitedAt: history.createdAt,
      });
    }
  });

  const recentUrls: RecentUrl[] = Array.from(normalizedUrls.values()).slice(0, 5);

  return (
    <DashWrapper
      recentUrls={recentUrls}
      subscription={serializedSubscription}
    />
  )
}

export default DashboardPage