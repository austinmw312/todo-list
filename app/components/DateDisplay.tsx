"use client"

export function DateDisplay() {
  const today = new Date()
  const formattedDate = today.toLocaleDateString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: '2-digit'
  })

  return (
    <p className="text-xl mt-2 text-muted-foreground">{formattedDate}</p>
  )
} 