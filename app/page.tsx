import { TaskList } from "./components/TaskList"
import { DateDisplay } from "./components/DateDisplay"

export default function Home() {
  return (
    <main className="container mx-auto p-4 max-w-2xl min-h-screen flex flex-col pt-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold">To Do List</h1>
        <DateDisplay />
      </div>
      <TaskList />
    </main>
  )
}
