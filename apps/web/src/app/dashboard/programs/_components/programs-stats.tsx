import { StatCard } from '@/components/ui/stat-card'
import { Music, FolderOpen, Headphones } from 'lucide-react'

export function ProgramsStats() {
  return (
    <div className="grid grid-cols-1 gap-2 lg:grid-cols-3 lg:gap-6 mt-8">
      <StatCard
        icon={Music}
        value="13"
        title="Dostępne programy"
      />
      <StatCard
        icon={FolderOpen}
        value="8"
        title="Kategorie tematyczne"
      />
      <StatCard
        icon={Headphones}
        value="156"
        title="Nagrania"
      />
    </div>
  )
}
