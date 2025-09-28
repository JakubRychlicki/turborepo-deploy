import { Hono } from 'hono'
import path from 'node:path'
import { mkdir, writeFile } from 'node:fs/promises'
import { randomUUID } from 'node:crypto'
import { prisma } from '@repo/database'
import { UPLOADS_ROOT } from '../lib/paths.js'

export const uploadRoutes = new Hono()

uploadRoutes.post('/api/upload', async (c) => {
  try {
    const rawRequest = c.req.raw

    const body = await rawRequest.arrayBuffer()
    const buffer = Buffer.from(body)
    
    const newRequest = new Request(rawRequest.url, {
      method: rawRequest.method,
      headers: rawRequest.headers,
      body: buffer
    })

    const formData = await newRequest.formData()
    const file = formData.get('file') as File

    if (!file || !(file instanceof File)) {
      return c.text('No file uploaded or file is not a File object', 400)
    }

    const maxBytes = 50 * 1024 * 1024  // 50MB
    if (file.size > maxBytes) {
      return c.text('File too large', 413)
    }

    const type = file.type || 'application/octet-stream'
    const allowed = ['image/', 'audio/mpeg', 'audio/mp3']
    if (!allowed.some((p) => type.startsWith(p))) {
      return c.text('Unsupported type', 415)
    }

    const now = new Date()
    const yyyy = String(now.getFullYear())
    const mm = String(now.getMonth() + 1).padStart(2, '0')

    const dirAbs = path.join(UPLOADS_ROOT, yyyy, mm)
    await mkdir(dirAbs, { recursive: true })

    const orig = file.name || 'file'
    const ext = path.extname(orig).toLowerCase()
    const key = `${randomUUID()}${ext}`

    const absPath = path.join(dirAbs, key)
    const relPath = path.posix.join(yyyy, mm, key)
    const publicUrl = `/uploads/${encodeURI(relPath)}`

    const buf = Buffer.from(await file.arrayBuffer())
    await writeFile(absPath, buf)

    const record = await prisma.media.create({
      data: {
        path: path.posix.join('uploads', relPath),
        filename: orig,
        mimeType: type,
        size: buf.length,
      },
      select: { id: true },
    })

    return c.json({ id: record.id, url: publicUrl })
  } catch (error) {
    console.error('Upload error:', error)
    return c.text(`Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`, 500)
  }
})
