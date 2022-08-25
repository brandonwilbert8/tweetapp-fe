import React, { useContext } from "react";
import Page from "./Page";
import { Link } from "react-router-dom";
import DispatchContext from "../DispatchContext";

function AfterRegister() {
  // const appDispatch = useContext(DispatchContext);
  // appDispatch.loggedIn = false;

  return (
    <Page title="Logging in">
      <h2 className="text-center">Welcome to TweetApp</h2>
      <p className="lead text-muted text-center">Please login by using the header bar</p>
      <Link to="/">
        <button className="btn btn-sm btn-danger bi-align-middle">Back</button>
      </Link>
    </Page>
  );
}

export default AfterRegister;
