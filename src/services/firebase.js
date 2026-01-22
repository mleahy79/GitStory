import { initializeApp } from "firebase/app";
import { getAuth, GithubAuthProvider } from "firebase/auth";
import { getFunctions, httpsCallable } from "firebase/functions";

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
export const functions = getFunctions(app);

// Request additional GitHub scopes for repo access
githubProvider.addScope("read:user");
githubProvider.addScope("repo");

// Claude chat function
export const chatWithClaude = async (message, repoContext = null) => {
  const chatFunction = httpsCallable(functions, "chat");
  const result = await chatFunction({ message, repoContext });
  return result.data.response;
};
