import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import WeRo from "./pages/WeRo";
import AuthProvider from "./context/AuthContext";
import { BrowserRouter } from "react-router-dom";
import FeedProvider from "./context/FeedContext";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <AuthProvider>
          <FeedProvider>
            <WeRo />
          </FeedProvider>
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
