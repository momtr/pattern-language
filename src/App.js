import "./App.css";
import { useGlobalState } from "./providers/GlobalStateProvider";
import { useCookie } from "./hooks/useCookie";
import { useEffect } from "react";
import {
  Route,
  Routes,
  BrowserRouter as Router,
  Navigate,
  useLocation,
} from "react-router-dom";
import Form from './components/Form/Form';

function App() {

  return (
    <div className="App">
      <Form />
    </div>
  );
}

export default App;
