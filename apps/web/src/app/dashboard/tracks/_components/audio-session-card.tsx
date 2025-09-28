"use client"

import type { AudioSession } from "@/types/audio_session"

interface AudioSessionCardProps {   
  audioSession: AudioSession
}

export function AudioSessionCard({ audioSession }: AudioSessionCardProps) {
  return (
    <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
      <div className="flex-1">
        <h3 className="font-semibold text-foreground">{audioSession.title}</h3>
      </div>
    </div>
  )
}