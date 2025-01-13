import { TaskList } from "./components/TaskList"

export default function Home() {
  const today = new Date()
  const formattedDate = today.toLocaleDateString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: '2-digit'
  })

  return (
    <main className="container mx-auto p-4 max-w-2xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">To Do List</h1>
        <p className="text-xl mt-1 text-muted-foreground">{formattedDate}</p>
      </div>
      <TaskList />
    </main>
  )
}
