import { initializeApp } from "firebase/app";
import { getAuth, GithubAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCZGbuCfS3RRtvK1Cynpv3EKra6pYoSErQ",
  authDomain: "sustainrx.firebaseapp.com",
  projectId: "sustainrx",
  storageBucket: "sustainrx.firebasestorage.app",
  messagingSenderId: "14017880747",
  appId: "1:14017880747:web:6e50634436d5b503c9cdee",
  measurementId: "G-VPQTC3X215"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const githubProvider = new GithubAuthProvider();

// Request additional GitHub scopes for repo access
githubProvider.addScope("read:user");
githubProvider.addScope("repo");
