import { StatCard } from '@/components/ui/stat-card'
import { Activity, Users, UserPlus } from 'lucide-react'

export function UsersStats() {
  return (
    <div className="grid grid-cols-1 gap-2 lg:grid-cols-3 lg:gap-6 mt-8">
    <StatCard
      icon={Users}
      value="1,234"
      title="Łączna liczba użytkowników"
      description="Aktywni użytkownicy aplikacji"
    />
    <StatCard
      icon={UserPlus}
      value="89"
      title="Nowi użytkownicy"
      description="W tym miesiącu"
    />
    <StatCard
      icon={Activity}
      value="89%"
      title="Aktywność"
      description="Aktywni w ostatnim tygodniu"
    />
  </div>
  )
}
