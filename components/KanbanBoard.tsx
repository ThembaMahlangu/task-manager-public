"use client"

import React, { useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Column from './Column';
import AddTaskForm from './AddTaskForm';
import StatusManager from './StatusManager';
import { Button } from '@/components/ui/button';
import { PlusCircle, Settings } from 'lucide-react';
import { ModeToggle } from './mode-toggle';
import { v4 as uuidv4 } from 'uuid';
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

export interface Subtask {
  id: string;
  content: string;
  description: string;
  completed: boolean;
}

export interface Task {
  id: string;
  content: string;
  description: string;
  status: string;
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  subtasks: Subtask[];
  assignee?: string;
  tags: string[];
  expanded: boolean;
}

export interface Status {
  id: string;
  name: string;
}

const KanbanBoard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [statuses, setStatuses] = useState<Status[]>([
    { id: 'todo', name: 'To Do' },
    { id: 'inProgress', name: 'In Progress' },
    { id: 'done', name: 'Done' }
  ]);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [isManagingStatuses, setIsManagingStatuses] = useState(false);

  useEffect(() => {
    const savedTasks = localStorage.getItem('kanbanTasks');
    const savedStatuses = localStorage.getItem('kanbanStatuses');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
    if (savedStatuses) {
      setStatuses(JSON.parse(savedStatuses));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('kanbanTasks', JSON.stringify(tasks));
    localStorage.setItem('kanbanStatuses', JSON.stringify(statuses));
  }, [tasks, statuses]);

  const moveTask = (taskId: string, newStatus: string) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );
  };

  const addTask = (
    content: string,
    description: string,
    status: string,
    priority: 'low' | 'medium' | 'high',
    dueDate: string,
    subtasks: { content: string; description: string }[],
    assignee: string,
    tags: string[]
  ) => {
    const newTask: Task = {
      id: uuidv4(),
      content,
      description,
      status,
      priority,
      dueDate,
      subtasks: subtasks.map(st => ({ id: uuidv4(), ...st, completed: false })),
      assignee,
      tags,
      expanded: true,
    };
    setTasks(prevTasks => [...prevTasks, newTask]);
    setIsAddingTask(false);
  };

  const deleteTask = (taskId: string) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
  };

  const editTask = (taskId: string, updatedTask: Partial<Task>) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, ...updatedTask } : task
      )
    );
  };

  const toggleSubtask = (taskId: string, subtaskId: string) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId
          ? {
              ...task,
              subtasks: task.subtasks.map(st =>
                st.id === subtaskId ? { ...st, completed: !st.completed } : st
              ),
            }
          : task
      )
    );
  };

  const toggleTaskExpansion = (taskId: string) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, expanded: !task.expanded } : task
      )
    );
  };

  const addStatus = (name: string) => {
    const newStatus: Status = { id: uuidv4(), name };
    setStatuses(prevStatuses => [...prevStatuses, newStatus]);
  };

  const editStatus = (id: string, newName: string) => {
    setStatuses(prevStatuses =>
      prevStatuses.map(status =>
        status.id === id ? { ...status, name: newName } : status
      )
    );
  };

  const deleteStatus = (id: string) => {
    setStatuses(prevStatuses => prevStatuses.filter(status => status.id !== id));
    // Move tasks from deleted status to 'To Do'
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.status === id ? { ...task, status: 'todo' } : task
      )
    );
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex flex-col space-y-4">
        <div className="flex justify-between items-center">
          <div className="space-x-2">
            <Button 
              onClick={() => setIsAddingTask(true)}
            >
              <PlusCircle className="mr-2 h-4 w-4" /> Add Task
            </Button>
            <Button
              onClick={() => setIsManagingStatuses(true)}
              variant="outline"
            >
              <Settings className="mr-2 h-4 w-4" /> Manage Statuses
            </Button>
          </div>
          <ModeToggle />
        </div>
        {isAddingTask && (
          <AddTaskForm 
            onAddTask={addTask} 
            onCancel={() => setIsAddingTask(false)} 
            statuses={statuses}
          />
        )}
        {isManagingStatuses && (
          <StatusManager
            statuses={statuses}
            onAddStatus={addStatus}
            onEditStatus={editStatus}
            onDeleteStatus={deleteStatus}
            onClose={() => setIsManagingStatuses(false)}
          />
        )}
        <ScrollArea className="w-full whitespace-nowrap rounded-md border">
          <div className="flex space-x-4 p-4">
            {statuses.map(status => (
              <Column
                key={status.id}
                title={status.name}
                tasks={tasks.filter(task => task.status === status.id)}
                status={status.id}
                moveTask={moveTask}
                deleteTask={deleteTask}
                editTask={editTask}
                toggleSubtask={toggleSubtask}
                toggleTaskExpansion={toggleTaskExpansion}
              />
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </DndProvider>
  );
};

export default KanbanBoard;