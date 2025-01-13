import { TaskList } from "./components/TaskList"

export default function Home() {
  return (
    <main className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8 text-center">Tasks</h1>
      <TaskList />
    </main>
  )
}
