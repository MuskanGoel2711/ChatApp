import React, { useEffect, useState } from 'react';
import { FlatList, Text, View } from 'react-native';
import { getRealm } from '../database/realm';

const TaskList = () => {
    const [tasks, setTasks] = useState([]);
    console.log('tasks', tasks);

    useEffect(() => {
        const fetchTasks = async () => {
            const realm = await getRealm();
            const tasks = realm.objects('Task');
            setTasks([...tasks]);
        };
        fetchTasks();
    }, []);

    return (
        <FlatList
            data={tasks}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
                <View>
                    <Text>{item.title}</Text>
                    <Text>{item.description}</Text>
                </View>
            )}
        />
    );
};

export default TaskList;