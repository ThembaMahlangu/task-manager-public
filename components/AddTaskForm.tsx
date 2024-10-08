"use client"

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Status } from './KanbanBoard';

interface AddTaskFormProps {
  onAddTask: (content: string, description: string, status: string, priority: 'low' | 'medium' | 'high', dueDate: string, subtasks: { content: string; description: string }[], assignee: string, tags: string[]) => void;
  onCancel: () => void;
  statuses: Status[];
}

const AddTaskForm: React.FC<AddTaskFormProps> = ({ onAddTask, onCancel, statuses }) => {
  const [content, setContent] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState(statuses[0]?.id || '');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [dueDate, setDueDate] = useState('');
  const [subtasks, setSubtasks] = useState<{ content: string; description: string }[]>([]);
  const [assignee, setAssignee] = useState('');
  const [tags, setTags] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim() && dueDate) {
      onAddTask(
        content,
        description,
        status,
        priority,
        dueDate,
        subtasks,
        assignee,
        tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '')
      );
      setContent('');
      setDescription('');
      setStatus(statuses[0]?.id || '');
      setPriority('medium');
      setDueDate('');
      setSubtasks([]);
      setAssignee('');
      setTags('');
    }
  };

  const addSubtask = () => {
    setSubtasks([...subtasks, { content: '', description: '' }]);
  };

  const updateSubtask = (index: number, field: 'content' | 'description', value: string) => {
    const updatedSubtasks = [...subtasks];
    updatedSubtasks[index][field] = value;
    setSubtasks(updatedSubtasks);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Task</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Enter task content"
            className="w-full"
          />
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter task description"
            className="w-full"
          />
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {statuses.map((status) => (
                <SelectItem key={status.id} value={status.id}>
                  {status.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={priority} onValueChange={(value: 'low' | 'medium' | 'high') => setPriority(value)}>
            <SelectTrigger className="w-full">
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
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full"
          />
          <div>
            <h4 className="text-sm font-semibold mb-2">Subtasks</h4>
            {subtasks.map((subtask, index) => (
              <div key={index} className="space-y-2 mb-2">
                <Input
                  type="text"
                  value={subtask.content}
                  onChange={(e) => updateSubtask(index, 'content', e.target.value)}
                  placeholder={`Subtask ${index + 1} content`}
                  className="w-full"
                />
                <Textarea
                  value={subtask.description}
                  onChange={(e) => updateSubtask(index, 'description', e.target.value)}
                  placeholder={`Subtask ${index + 1} description`}
                  className="w-full"
                />
              </div>
            ))}
            <Button type="button" onClick={addSubtask} variant="outline" size="sm">
              Add Subtask
            </Button>
          </div>
          <Input
            type="text"
            value={assignee}
            onChange={(e) => setAssignee(e.target.value)}
            placeholder="Assignee"
            className="w-full"
          />
          <Input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="Tags (comma-separated)"
            className="w-full"
          />
          <div className="flex justify-end space-x-2">
            <Button type="submit">Add Task</Button>
            <Button variant="outline" onClick={onCancel}>Cancel</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddTaskForm;