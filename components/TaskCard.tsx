"use client"

import React, { useState } from 'react';
import { useDrag } from 'react-dnd';
import { Task, Subtask } from './KanbanBoard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, Edit2, Calendar, Flag, User, Tag, ChevronDown, ChevronUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

interface TaskCardProps {
  task: Task;
  deleteTask: (taskId: string) => void;
  editTask: (taskId: string, updatedTask: Partial<Task>) => void;
  toggleSubtask: (taskId: string, subtaskId: string) => void;
  toggleTaskExpansion: (taskId: string) => void;
}

const priorityColors = {
  low: 'bg-green-500',
  medium: 'bg-yellow-500',
  high: 'bg-red-500',
};

const TaskCard: React.FC<TaskCardProps> = ({ task, deleteTask, editTask, toggleSubtask, toggleTaskExpansion }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'TASK',
    item: { id: task.id },
    collect: monitor => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState(task);

  const handleEdit = () => {
    editTask(task.id, editedTask);
    setIsEditing(false);
  };

  const renderSubtasks = (subtasks: Subtask[]) => {
    return (
      <div className="mt-2">
        <h4 className="text-sm font-semibold mb-1">Subtasks</h4>
        {subtasks.map((subtask) => (
          <div key={subtask.id} className="flex items-start mb-2">
            <Checkbox
              checked={subtask.completed}
              onCheckedChange={() => toggleSubtask(task.id, subtask.id)}
              id={subtask.id}
              className="mt-1"
            />
            <div className="ml-2">
              <label
                htmlFor={subtask.id}
                className={`text-sm ${subtask.completed ? 'line-through text-gray-500' : ''}`}
              >
                {subtask.content}
              </label>
              {subtask.description && (
                <p className="text-xs text-gray-500 mt-1">{subtask.description}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div ref={drag} style={{ opacity: isDragging ? 0.5 : 1 }}>
      <Card className="cursor-move hover:shadow-lg transition-shadow duration-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold flex justify-between items-center">
            <span>{task.content}</span>
            <div className="flex items-center">
              <span className="text-sm text-gray-500 mr-2">#{task.id.slice(0, 8)}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleTaskExpansion(task.id)}
              >
                {task.expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-2">
            <Badge variant="outline" className={`${priorityColors[task.priority]} text-white`}>
              <Flag className="h-3 w-3 mr-1" />
              {task.priority}
            </Badge>
            <Badge variant="outline">
              <Calendar className="h-3 w-3 mr-1" />
              {new Date(task.dueDate).toLocaleDateString()}
            </Badge>
            {task.assignee && (
              <Badge variant="outline">
                <User className="h-3 w-3 mr-1" />
                {task.assignee}
              </Badge>
            )}
            {task.tags && task.tags.map((tag, index) => (
              <Badge key={index} variant="secondary">
                <Tag className="h-3 w-3 mr-1" />
                {tag}
              </Badge>
            ))}
          </div>
          {task.expanded && (
            <>
              {task.description && (
                <p className="text-sm text-gray-600 mb-2">{task.description}</p>
              )}
              {task.subtasks && task.subtasks.length > 0 && renderSubtasks(task.subtasks)}
            </>
          )}
          <div className="flex justify-end space-x-2 mt-4">
            <Dialog open={isEditing} onOpenChange={setIsEditing}>
              <DialogTrigger asChild>
                <Button variant="outline" size="icon">
                  <Edit2 className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Task</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <Input
                    value={editedTask.content}
                    onChange={(e) => setEditedTask({ ...editedTask, content: e.target.value })}
                    placeholder="Task content"
                  />
                  <Textarea
                    value={editedTask.description}
                    onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
                    placeholder="Task description"
                  />
                  <Select
                    value={editedTask.priority}
                    onValueChange={(value: 'low' | 'medium' | 'high') => setEditedTask({ ...editedTask, priority: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    type="date"
                    value={editedTask.dueDate}
                    onChange={(e) => setEditedTask({ ...editedTask, dueDate: e.target.value })}
                  />
                  <Input
                    value={editedTask.assignee || ''}
                    onChange={(e) => setEditedTask({ ...editedTask, assignee: e.target.value })}
                    placeholder="Assignee"
                  />
                  <Input
                    value={editedTask.tags ? editedTask.tags.join(', ') : ''}
                    onChange={(e) => setEditedTask({ ...editedTask, tags: e.target.value.split(',').map(tag => tag.trim()) })}
                    placeholder="Tags (comma-separated)"
                  />
                  <Button onClick={handleEdit}>Save Changes</Button>
                </div>
              </DialogContent>
            </Dialog>
            <Button
              variant="destructive"
              size="icon"
              onClick={() => deleteTask(task.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TaskCard;