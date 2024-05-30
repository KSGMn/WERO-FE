import { Link, Outlet, useNavigate } from "react-router-dom";
import { useFeeds } from "../context/FeedContext";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const AdminComponent = () => {
  const { setIsFetching, setInitialLoad, setPage } = useFeeds();
  const { authNavigate } = useContext(AuthContext);

  const handlePage = (e) => {
    const { name } = e.target;
    let path = "/admin/reports";
    if (name === "suspended") {
      path = "/admin/user/suspension";
    }
    setPage(0);
    setInitialLoad(false);
    setIsFetching(true);
    authNavigate(path);
  };

  return (
    <div className="admin-container">
      <h1 className="admin-title">Admin Page</h1>
      <div className="button-container">
        <Link to="/admin/reports">
          <button className="styled-button" name="reports" onClick={handlePage}>
            Reports
          </button>
        </Link>
        <Link to="/admin/user/suspension">
          <button className="styled-button" name="suspended" onClick={handlePage}>
            Suspended Users
          </button>
        </Link>
      </div>
      <Outlet />
    </div>
  );
};

export default AdminComponent;
