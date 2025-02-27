export const TaskSchema = {
    name: 'Task',
    primaryKey: 'id',
    properties: {
      id: 'int',
      title: 'string',
      description: 'string',
      isCompleted: { type: 'bool', default: false },
    },
  };