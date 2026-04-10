/**
 * Shared utility for handling offline data and route caching
 */

export async function checkTopicDownloaded(topicId: string): Promise<boolean> {
  if (typeof window === "undefined") return false;
  
  // 1. Check logical flag
  const isFlagged = localStorage.getItem(`topic_${topicId}_offline`) === "true";
  if (!isFlagged) return false;

  // 2. Physical Cache Verification (Source of Truth)
  if ("caches" in window) {
    try {
      const cache = await caches.open("dopog-cache-v1");
      const match = await cache.match(`/api/topics/${topicId}/questions`);
      return !!match;
    } catch (e) {
      return false;
    }
  }
  
  return true;
}

export async function downloadTopic(
  topicId: string, 
  courseId: string, 
  onProgress?: (p: number) => void
): Promise<void> {
  if (typeof window === "undefined") return;

  try {
    const response = await fetch(`/api/topics/${topicId}/questions`);
    if (!response.ok) throw new Error("Failed to fetch questions");
    const questions = await response.json();

    localStorage.setItem(`topic_${topicId}_data`, JSON.stringify(questions));

    if ("caches" in window) {
      const cache = await caches.open("dopog-cache-v1");
      
      // Cache the API response itself for physical verification by checkTopicDownloaded
      await cache.put(
        `/api/topics/${topicId}/questions`,
        new Response(JSON.stringify(questions), {
          headers: { 'Content-Type': 'application/json' }
        })
      );
      
      // Robust individual asset caching
      const studyUrl = `/study/${courseId}?topicId=${topicId}`;
      const assets = [
        studyUrl,
        `${studyUrl}&_rsc=1`, // RSC Data for this specific topic
        "/manifest.json",
        "/icon.png"
      ];

      // Add topic images
      questions.forEach((q: any) => {
        if (q.imageUrl) assets.push(q.imageUrl);
      });

      // Sequential cache put (avoiding addAll which fails on 1 error)
      for (let i = 0; i < assets.length; i++) {
        try {
          const assetResponse = await fetch(assets[i]);
          if (assetResponse.ok) {
            await cache.put(assets[i], assetResponse);
          }
        } catch (e) {
          console.warn(`[Sync] Failed to cache asset: ${assets[i]}`, e);
        }
        if (onProgress) {
          onProgress(Math.round(((i + 1) / assets.length) * 100));
        }
      }
    }

    localStorage.setItem(`topic_${topicId}_offline`, "true");
  } catch (error) {
    console.error(`Download failed for topic ${topicId}:`, error);
    throw error;
  }
}

export async function downloadCourse(
  courseId: string,
  slug: string,
  themeIds: string[],
  onProgress?: (topicId: string, p: number) => void
): Promise<void> {
  if (typeof window === "undefined") return;

  // 1. Static Content Snapshots (HTML + Navigation Data)
  if ("caches" in window) {
    const cache = await caches.open("dopog-cache-v1");
    // We only snapshot the Home and the current Course
    const snapshots = [
      "/",
      `/course/${slug}`
    ];
    
    for (const route of snapshots) {
      try {
        // Fetch raw HTML
        const htmlRes = await fetch(route);
        if (htmlRes.ok) await cache.put(route, htmlRes);

        // Fetch RSC Navigation Data
        const rscUrl = `${route}${route.includes("?") ? "&" : "?"}_rsc=1`;
        const rscRes = await fetch(rscUrl, { headers: { "RSC": "1" } });
        if (rscRes.ok) await cache.put(rscUrl, rscRes);
      } catch (e) {
        console.warn(`[Snapshot] Failed to capture: ${route}`, e);
      }
    }
  }

  // 2. Download all topics sequentially
  for (const topicId of themeIds) {
    await downloadTopic(topicId, courseId, (p) => {
      if (onProgress) onProgress(topicId, p);
    });
  }
}
