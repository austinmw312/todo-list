"use client"

import { Task } from "@/app/types/task"
import { useState, useEffect } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Pencil, Trash2, Plus, GripVertical, Check, X } from "lucide-react"
import { 
  DndContext, 
  DragEndEvent, 
  closestCenter,
  TouchSensor,
  MouseSensor,
  useSensor,
  useSensors
} from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

function SortableTask({ 
  task, 
  toggleTask, 
  deleteTask,
  updateTask 
}: { 
  task: Task; 
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  updateTask: (id: string, content: string) => void;
}) {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(task.content)
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: task.id,
  })

  const handleSave = () => {
    updateTask(task.id, editValue)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditValue(task.content)
    setIsEditing(false)
  }

  const handleStartEdit = () => {
    setEditValue(task.content === "New Task" ? "" : task.content)
    setIsEditing(true)
  }

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
      <button 
        {...attributes} 
        {...listeners} 
        className="p-2 -m-2 touch-manipulation"
      >
        <GripVertical className="h-6 w-6 text-muted-foreground" />
      </button>
      <Checkbox 
        checked={task.completed}
        onCheckedChange={() => toggleTask(task.id)}
        className="h-6 w-6 data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
      />
      {isEditing ? (
        <div className="flex-grow flex items-center space-x-2">
          <Input
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className="flex-grow"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSave()
              if (e.key === 'Escape') handleCancel()
            }}
          />
          <Button variant="ghost" size="icon" onClick={handleSave}>
            <Check className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={handleCancel}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <span className={`flex-grow ${task.completed ? 'line-through text-green-500' : ''}`}>
          {task.content}
        </span>
      )}
      <div className="flex space-x-2">
        {!isEditing && (
          <Button variant="ghost" size="icon" onClick={handleStartEdit}>
            <Pencil className="h-4 w-4" />
          </Button>
        )}
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
  const [isLoaded, setIsLoaded] = useState(false)

  // Load tasks from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('tasks')
    if (saved) {
      setTasks(JSON.parse(saved))
    }
    setIsLoaded(true)
  }, [])

  // Save to localStorage whenever tasks change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('tasks', JSON.stringify(tasks))
    }
  }, [tasks, isLoaded])

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 0,
        tolerance: 0,
        distance: 0,
      },
    })
  )

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

  const updateTask = (taskId: string, content: string) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, content } : task
    ))
  }

  // Only render content after initial load
  if (!isLoaded) {
    return null
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={addTask} size="icon" variant="outline">
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      
      <DndContext 
        sensors={sensors}
        collisionDetection={closestCenter} 
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={tasks} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <SortableTask 
              key={task.id} 
              task={task} 
              toggleTask={toggleTask}
              deleteTask={deleteTask}
              updateTask={updateTask}
            />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  )
} 