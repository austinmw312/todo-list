"use client"

import { Task } from "@/app/types/task"
import { useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2, Plus, GripVertical } from "lucide-react"
import { DndContext, DragEndEvent, closestCenter } from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

function SortableTask({ 
  task, 
  toggleTask, 
  deleteTask 
}: { 
  task: Task; 
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: task.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div 
      ref={setNodeRef}
      style={style}
      className="flex items-center space-x-4 p-4 border rounded-lg bg-card"
    >
      <button {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
        <GripVertical className="h-4 w-4 text-muted-foreground" />
      </button>
      <Checkbox 
        checked={task.completed}
        onCheckedChange={() => toggleTask(task.id)}
        className="data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
      />
      <span className={`flex-grow ${task.completed ? 'line-through text-green-500' : ''}`}>
        {task.content}
      </span>
      <div className="flex space-x-2">
        <Button variant="ghost" size="icon">
          <Pencil className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => deleteTask(task.id)}
          className="text-red-500 hover:text-red-700 hover:bg-red-500/20"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

export function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([])

  const addTask = () => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      content: "New Task",
      completed: false,
      position: tasks.length,
    }
    setTasks([...tasks, newTask])
  }

  const toggleTask = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ))
  }

  const deleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId))
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    setTasks(tasks => {
      const oldIndex = tasks.findIndex(task => task.id === active.id)
      const newIndex = tasks.findIndex(task => task.id === over.id)

      const newTasks = [...tasks]
      const [movedTask] = newTasks.splice(oldIndex, 1)
      newTasks.splice(newIndex, 0, movedTask)
      
      return newTasks
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={addTask} size="icon" variant="outline">
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={tasks} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <SortableTask 
              key={task.id} 
              task={task} 
              toggleTask={toggleTask}
              deleteTask={deleteTask}
            />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  )
} 