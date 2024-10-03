// getSearchHistory.ts
export async function getSearchHistory() {
  try {
    console.log('Fetching search history from API...');
    const response = await fetch('/api/search-history', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch search history');
    }

    const data = await response.json();
    console.log('Received search history data:', data);
    return { status: 200, data };
  } catch (error) {
    console.error('Error fetching search history:', error);
    return { status: 400, message: 'Error fetching search history', data: [] };
  }
}