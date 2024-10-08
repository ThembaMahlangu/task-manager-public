"use client"

import React, { useState } from 'react';
import { Status } from './KanbanBoard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X, Edit, Trash } from 'lucide-react';

interface StatusManagerProps {
  statuses: Status[];
  onAddStatus: (name: string) => void;
  onEditStatus: (id: string, newName: string) => void;
  onDeleteStatus: (id: string) => void;
  onClose: () => void;
}

const StatusManager: React.FC<StatusManagerProps> = ({
  statuses,
  onAddStatus,
  onEditStatus,
  onDeleteStatus,
  onClose,
}) => {
  const [newStatusName, setNewStatusName] = useState('');
  const [editingStatus, setEditingStatus] = useState<string | null>(null);
  const [editedName, setEditedName] = useState('');

  const handleAddStatus = () => {
    if (newStatusName.trim()) {
      onAddStatus(newStatusName.trim());
      setNewStatusName('');
    }
  };

  const handleEditStatus = (id: string) => {
    if (editedName.trim()) {
      onEditStatus(id, editedName.trim());
      setEditingStatus(null);
      setEditedName('');
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          Manage Statuses
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex space-x-2">
            <Input
              value={newStatusName}
              onChange={(e) => setNewStatusName(e.target.value)}
              placeholder="New status name"
            />
            <Button onClick={handleAddStatus}>Add Status</Button>
          </div>
          <div className="space-y-2">
            {statuses.map((status) => (
              <div key={status.id} className="flex items-center space-x-2">
                {editingStatus === status.id ? (
                  <>
                    <Input
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                    />
                    <Button onClick={() => handleEditStatus(status.id)}>Save</Button>
                  </>
                ) : (
                  <>
                    <span className="flex-grow">{status.name}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setEditingStatus(status.id);
                        setEditedName(status.name);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDeleteStatus(status.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatusManager;