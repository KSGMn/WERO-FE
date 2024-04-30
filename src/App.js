import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import WeRo from "./pages/WeRo";
import UserProvider from "./context/UserContext";
import { BrowserRouter } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <UserProvider>
        <BrowserRouter>
          <WeRo />
        </BrowserRouter>
      </UserProvider>
    </div>
  );
}

export default App;
