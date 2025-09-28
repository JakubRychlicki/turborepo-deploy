import { Prisma } from '../../prisma/generated/prisma/index.js'

const UPLOADS_BASE_URL = '/uploads'

export const mediaUrlExtension = Prisma.defineExtension({
  result: {
    media: {
      url: {
        needs: { path: true },
        compute(media) {
          const baseUrl = process.env.API_BASE_URL || 'http://localhost:3000'
          const cleanPath = media.path.replace('uploads/', '')
          return `${baseUrl}${UPLOADS_BASE_URL}/${cleanPath}`
        }
      }
    }
  }
})
