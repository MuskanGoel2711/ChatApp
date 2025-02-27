import React from 'react';
import { Button } from 'react-native';
import { getRealm } from '../database/realm';

const DeleteTask = ({ taskId }) => {
  const handleDeleteTask = async () => {
    const realm = await getRealm();
    const task = realm.objectForPrimaryKey('Task', taskId);
    realm.write(() => {
      realm.delete(task);
    });
  };

  return <Button title="Delete Task" onPress={handleDeleteTask} />;
};

export default DeleteTask;