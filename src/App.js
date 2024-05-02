import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import WeRo from "./pages/WeRo";
import AuthProvider from "./context/AuthContext";
import { BrowserRouter } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <BrowserRouter>
          <WeRo />
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}

export default App;
