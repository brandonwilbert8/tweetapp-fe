import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import DispatchContext from "../DispatchContext";
import StateContext from "../StateContext";
import ReactTooltip from "react-tooltip";
import { useParams } from "react-router-dom";

function HeaderLoggedIn(props) {
  const appDispatch = useContext(DispatchContext);
  const appState = useContext(StateContext);
  const currentUser = localStorage.getItem("tweetappUsername");

  function handleLogout() {
    appDispatch({ type: "logout" });
    localStorage.removeItem("tweetappUsername");
    localStorage.removeItem("tweetappPassword");
    localStorage.clear();
    sessionStorage.clear();

    window.location.href = "/";
    appState({ type: "logout" });
    window.history.forward();
    window.location.clear();
    window.location.reload();
  }

  function handleProfile() {
    appDispatch({ type: "login" });
    window.location.href = `/profile/${currentUser}`;
    //window.location.reload();
  }

  /*
  <a href="#" className="mr-2">
        <img className="small-header-avatar" src={localStorage.getItem("tweetappAvatar")} />
      </a>
  */
  return (
    <div className="flex-row my-3 my-md-0">
      <Link data-tip="Search All Users on TweetApp" data-for="searchallusers" className="btn btn-sm btn-info mr-1" to="/allusers">
        All Users
      </Link>
      <ReactTooltip place="bottom" id="searchallusers" className="custom-tooltip" />
      <Link data-tip="Discover all posted tweets on TweetApp" data-for="discovertweets" className="btn btn-sm btn-secondary mr-1" to="/discovertweets">
        Discover Tweets
      </Link>
      <ReactTooltip place="bottom" id="discovertweets" className="custom-tooltip" />
      {/* <Link data-tip="Currently logged in as:" data-for="currentuser" className="btn btn-sm btn-light mr-1" to={`profile/${currentUser}`} key={currentUser}>
        <strong>{currentUser}</strong>
      </Link> */}
      <button data-tip="Currently logged in as:" data-for="currentuser" className="btn btn-sm btn-light mr-1" onClick={handleProfile}>
        <strong>{currentUser}</strong>
      </button>
      <ReactTooltip place="bottom" id="currentuser" className="custom-tooltip" />
      <Link data-tip="Create a new tweet" data-for="createtweet" className="btn btn-sm btn-success mr-1" to="/create-post">
        Create Tweet
      </Link>
      <ReactTooltip place="bottom" id="createtweet" className="custom-tooltip" />
      <button data-tip="Sign out from TweetApp" data-for="signout" onClick={handleLogout} className="btn btn-sm btn-danger mr-auto" href="/">
        Sign Out
      </button>
      <ReactTooltip place="bottom" id="signout" className="custom-tooltip" />
    </div>
  );
}

export default HeaderLoggedIn;
