import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";
import Chat from "./pages/Chat";
import History from "./pages/History";
import ConversationDetail from "./pages/ConversationDetail";
import Overview from "./pages/Overview";

export default function App(){
  return (
    <div className="app">
      <Router>
        <nav className="nav card">
          <NavLink to="/">Chat</NavLink>
          <NavLink to="/history">History</NavLink>
          <NavLink to="/overview">Feedback Overview</NavLink>
        </nav>

        <Routes>
          <Route path="/" element={<Chat/>}/>
          <Route path="/history" element={<History/>}/>
          <Route path="/history/:id" element={<ConversationDetail/>}/>
          <Route path="/overview" element={<Overview/>}/>
        </Routes>
      </Router>
    </div>
  );
}
