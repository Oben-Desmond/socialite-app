import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.socionet',
  appName: 'socionet',
  webDir: 'build',
  bundledWebRuntime: false,
  "plugins": {
    "PushNotifications": {
      "presentationOptions": ["badge", "sound", "alert"]
    },
  
  "server": {
    "url": "http://192.168.43.123:8100",
    "cleartext": true
  }

  } 
 
};

export default config;



  // "server": {
  //   "url": "http://192.168.43.123:8100",
  //   "cleartext": true
  // }

  // LocalNotifications: {
  //   smallIcon: "ic_stat_icon_config_sample",
  //   iconColor: "#488AFF",
  //   sound: "beep.wav",
  // },