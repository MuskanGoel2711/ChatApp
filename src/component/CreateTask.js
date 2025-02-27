import React, { useState } from 'react';
import { View, TextInput, Button } from 'react-native';
import { getRealm } from '../database/realm';

const CreateTask = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const handleCreateTask = async () => {
        const realm = await getRealm();
        realm.write(() => {
            realm.create('Task', {
                id: Math.floor(Math.random() * 100000), // Generate a random ID
                title,
                description,
                isCompleted: false,
            });
        });
        setTitle('');
        setDescription('');
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
            <Button title="Create Task" onPress={handleCreateTask} />
        </View>
    );
};

export default CreateTask;