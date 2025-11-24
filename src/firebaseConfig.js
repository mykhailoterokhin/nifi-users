import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCqcpW6BmmmbBsUs49Mq8_Vltw5aGmxHkw",
  authDomain: "nifi-dashboard.firebaseapp.com",
  projectId: "nifi-dashboard",
  storageBucket: "nifi-dashboard.firebasestorage.app",
  messagingSenderId: "463115975460",
  appId: "1:463115975460:web:ac9f09a4e0ee748e3651b1",
  measurementId: "G-8KC1YH5WXR"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
