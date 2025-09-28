interface SearchParamsProps {
  searchParams?: Promise<{
    id: string
  }>
}

export default async function UserPage(props: SearchParamsProps) {
  const searchParams = await props.searchParams
  const userId = searchParams?.id

  return <div>UserPage {userId}</div>
}
