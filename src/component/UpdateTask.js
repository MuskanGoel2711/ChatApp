import React, { useState } from 'react';
import { View, TextInput, Button } from 'react-native';
import { getRealm } from '../database/realm';

const UpdateTask = ({ taskId }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleUpdateTask = async () => {
    const realm = await getRealm();
    const task = realm.objectForPrimaryKey('Task', taskId);
    realm.write(() => {
      task.title = title;
      task.description = description;
    });
  };

  return (
    <View>
      <TextInput
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
      />
      <Button title="Update Task" onPress={handleUpdateTask} />
    </View>
  );
};

export default UpdateTask;