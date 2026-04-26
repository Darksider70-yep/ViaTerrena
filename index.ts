import { registerRootComponent } from 'expo';

import App from './App';

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
import AsyncStorage from '@react-native-async-storage/async-storage';

// EMERGENCY CLEANUP: Fixes java.lang.String cannot be cast to java.lang.Boolean
// by wiping potentially corrupt keys before the app engine starts.
const CLEANUP_KEY = 'via_terrena_v3_cleanup';
AsyncStorage.getItem(CLEANUP_KEY).then(val => {
  if (val !== 'done') {
    AsyncStorage.clear().then(() => {
      AsyncStorage.setItem(CLEANUP_KEY, 'done');
    });
  }
});

registerRootComponent(App);
