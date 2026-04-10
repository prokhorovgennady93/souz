import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'ДОПОГ Экзамен 2026',
    short_name: 'ДОПОГ',
    description: 'Лучшая платформа для подготовки к экзаменам ДОПОГ (ADR) онлайн.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#f59e0b',
    icons: [
      {
        src: '/icon.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
