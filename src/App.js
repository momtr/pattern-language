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
      <Router>
        <Routes>
          <Route path="">
            <Route path="new" element={<New />}/>
            <Route path="" element={<Navigate to={{pathname: '/new', state: { from: '/' }}}/>} />  
          </Route>  
        </Routes>
      </Router>
    </div>
  );
}

export default App;
