interface QualityInfo {
  resolution: number      
  isRemux: boolean       
  isHevc: boolean         
  score: number      
}

function parseQuality(title: string): QualityInfo {
  const t = title.toLowerCase()

  let resolution = 0
  if (/2160p|uhd|\b4k\b/.test(t)) resolution = 2160
  else if (/1080p/.test(t)) resolution = 1080
  else if (/720p/.test(t)) resolution = 720
  else if (/480p/.test(t)) resolution = 480

  if (resolution === 0 && !/2160p|uhd|4k/.test(t)) {
    resolution = 576
  }

  const isRemux = /remux/.test(t)
  const isHevc = /hevc|x265|h\.?265/.test(t)

  const targetDistance = Math.abs(resolution - 1080)

  let score = 1000 - targetDistance
  if (isRemux) score -= 300    
  if (isHevc) score -= 50        
  if (resolution > 1080) score -= 200 

  return { resolution, isRemux, isHevc, score }
}

export function sortTorrentsByQuality<T extends { title: string }>(torrents: T[]): T[] {
  return [...torrents].sort((a, b) => parseQuality(b.title).score - parseQuality(a.title).score)
}


export function excludeUHD<T extends { title: string }>(torrents: T[]): T[] {
  return torrents.filter(t => !/2160p|uhd|\b4k\b/i.test(t.title))
}