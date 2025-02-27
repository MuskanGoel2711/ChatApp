import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { getRealm } from '../../database/realm';

const RealmTask = () => {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [editingTask, setEditingTask] = useState(null);

  const fetchTasks = async () => {
    const realm = await getRealm();
    console.log('realm', realm)
    const tasks = realm.objects('Task').sorted('id');
    setTasks([...tasks]);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleSaveTask = async () => {
    const realm = await getRealm();
    realm.write(() => {
      if (editingTask) {
        editingTask.title = title;
        editingTask.description = description;
      } else {
        realm.create('Task', {
          id: Math.floor(Math.random() * 100000),
          title,
          description,
          isCompleted: false,
        });
      }
    });

    setTitle('');
    setDescription('');
    setEditingTask(null);
    fetchTasks();
  };

  const handleDeleteTask = async (taskId) => {
    const realm = await getRealm();
    const task = realm.objectForPrimaryKey('Task', taskId);
    realm.write(() => {
      realm.delete(task);
    });
    fetchTasks();
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setTitle(task.title);
    setDescription(task.description);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
      />
      <Button
        title={editingTask ? 'Update Task' : 'Add Task'}
        onPress={handleSaveTask}

      />
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.taskItem}>
            <Text style={styles.taskTitle}>{item.title}</Text>
            <Text>{item.description}</Text>
            <View style={styles.buttonsContainer}>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => handleEditTask(item)}
              >
                <Text style={styles.buttonText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDeleteTask(item.id)}
              >
                <Text style={styles.buttonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
};

export default RealmTask;