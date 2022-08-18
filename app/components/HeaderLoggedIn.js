import React, { useContext } from "react";
import { Link } from "react-router-dom";
import DispatchContext from "../DispatchContext";
import StateContext from "../StateContext";

function HeaderLoggedIn(props) {
  const appDispatch = useContext(DispatchContext);
  const appState = useContext(StateContext);

  function handleLogout() {
    appDispatch({ type: "logout" });
    localStorage.removeItem("tweetappUsername");
    localStorage.removeItem("tweetappPassword");
    localStorage.clear();
    window.location.href = "/";
  }
  /*
  <a href="#" className="mr-2">
        <img className="small-header-avatar" src={localStorage.getItem("tweetappAvatar")} />
      </a>
  */
  return (
    <div className="flex-row my-3 my-md-0">
      <Link className="btn btn-sm btn-info mr-1" to="/allusers">
        All Users
      </Link>
      <Link className="btn btn-sm btn-secondary mr-1" to="/discovertweets">
        Discover Tweets
      </Link>
      <Link className="btn btn-sm btn-light mr-1" to={`profile/${localStorage.getItem("tweetappUsername")}`}>
        {localStorage.getItem("tweetappUsername")}
      </Link>
      <Link className="btn btn-sm btn-success mr-1" to="/create-post">
        Create Tweet
      </Link>
      <button onClick={handleLogout} className="btn btn-sm btn-danger mr-auto" href="/">
        Sign Out
      </button>
    </div>
  );
}

export default HeaderLoggedIn;
