import Realm from 'realm';
import { TaskSchema } from './TaskSchema';

export const getRealm = async () => {
    return await Realm.open({
        schema: [TaskSchema],
        schemaVersion: 1,
    });
};
