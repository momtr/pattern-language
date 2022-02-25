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
import New from './components/New/New';

function App() {

  return (
    <div className="App">
      <New />
    </div>
  );
}

export default App;
