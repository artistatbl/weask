export function checkWebsiteEmbeddability(url: string): Promise<{ embeddable: boolean; message: string }> {
  return new Promise((resolve) => {
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = url;

    const timeoutId = setTimeout(() => {
      document.body.removeChild(iframe);
      resolve({
        embeddable: false,
        message: "The website couldn't be loaded. It may be protected against embedding or the connection timed out."
      });
    }, 5000);

    iframe.onload = () => {
      clearTimeout(timeoutId);
      document.body.removeChild(iframe);
      resolve({ embeddable: true, message: "Website preview loaded successfully." });
    };

    iframe.onerror = () => {
      clearTimeout(timeoutId);
      document.body.removeChild(iframe);
      resolve({
        embeddable: false,
        message: "This website cannot be displayed in a preview. It may be protected against embedding."
      });
    };

    document.body.appendChild(iframe);
  });
}