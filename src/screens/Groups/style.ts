import { StyleSheet } from 'react-native';
import { vw, vh } from '../../utils/Dimensions';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f5f7'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#6200ea',
  },
  icon: {
    width: vw(30),
    height: vh(30),
    marginVertical: 20,
    tintColor: 'black',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  user: {
    width: 23,
    height: 23,
    tintColor: '#7E50EA'
  },
  groupItem: {
    flex: 1,
    alignSelf: 'center',
    marginTop: 15,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    justifyContent: 'space-between',
    // backgroundColor: 'white',
    borderRadius: 10
  },
  userInfo: {
    flex: 1,
    marginLeft: 10
  },
  lastMessage: {
    fontSize: 14,
    color: 'gray'
  },
  timeAgo: {
    fontSize: 12,
    color: 'gray'
  },
  groupName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black'
  },
  emptyView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  emptyText: {
    fontSize: 20,
  },
});

export default styles;
