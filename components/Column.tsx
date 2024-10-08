"use client"

import React from 'react';
import { useDrop } from 'react-dnd';
import TaskCard from './TaskCard';
import { Task } from './KanbanBoard';

interface ColumnProps {
  title: string;
  tasks: Task[];
  status: string;
  moveTask: (taskId: string, newStatus: string) => void;
  deleteTask: (taskId: string) => void;
  editTask: (taskId: string, updatedTask: Partial<Task>) => void;
  toggleSubtask: (taskId: string, subtaskId: string) => void;
  toggleTaskExpansion: (taskId: string) => void;
}

const Column: React.FC<ColumnProps> = ({ 
  title, 
  tasks, 
  status, 
  moveTask, 
  deleteTask, 
  editTask, 
  toggleSubtask,
  toggleTaskExpansion 
}) => {
  const [{ isOver }, drop] = useDrop({
    accept: 'TASK',
    drop: (item: { id: string }) => moveTask(item.id, status),
    collect: monitor => ({
      isOver: !!monitor.isOver(),
    }),
  });

  return (
    <div
      ref={drop}
      className={`flex-none w-72 p-4 bg-background border border-border rounded-lg shadow-md ${
        isOver ? 'bg-accent' : ''
      }`}
    >
      <h2 className="text-xl font-semibold mb-4 text-primary">{title}</h2>
      <div className="space-y-4">
        {tasks.map(task => (
          <TaskCard
            key={task.id}
            task={task}
            deleteTask={deleteTask}
            editTask={editTask}
            toggleSubtask={toggleSubtask}
            toggleTaskExpansion={toggleTaskExpansion}
          />
        ))}
      </div>
    </div>
  );
};

export default Column;