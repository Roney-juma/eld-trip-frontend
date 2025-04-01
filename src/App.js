import Router from "./routes";
import { ToastContainer, toast } from 'react-toastify';
import "./index.css";

export default function App() {
  return (
    <>
      <ToastContainer />
      <Router />
    </>
  );
}
