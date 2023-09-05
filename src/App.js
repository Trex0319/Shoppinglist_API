import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home";
import ItemAdd from "./ItemAdd";
import ItemEdit from "./ItemEdit";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/item_add" element={<ItemAdd />} />
        <Route path="/items/:id" element={<ItemEdit />} />
      </Routes>
    </Router>
  );
}

export default App;
