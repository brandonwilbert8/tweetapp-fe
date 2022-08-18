import React, { useState, useContext } from "react";
import Page from "./Page";
import Axios from "axios";
import StateContext from "../StateContext";

function Home() {
  const appState = useContext(StateContext);

  return (
    <Page title="Your Feed">
      <h2 className="text-center">
        Hello <strong>{localStorage.getItem("tweetappUsername")}</strong>
      </h2>
      <p className="lead text-muted text-center">Welcome to TweetApp</p>
    </Page>
  );
}

export default Home;
