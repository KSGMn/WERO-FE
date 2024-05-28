import { Link, Outlet, useNavigate } from "react-router-dom";
import { useFeeds } from "../context/FeedContext";

const AdminComponent = () => {
  const { setIsFetching, setInitialLoad, setPage } = useFeeds();
  const navigate = useNavigate();

  const handlePage = (e) => {
    const { name } = e.target;
    let path = "/admin/reports";
    if (name === "suspended") {
      path = "/admin/user/suspension";
    }
    setPage(0);
    setInitialLoad(false);
    setIsFetching(true);
    navigate(path);
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
