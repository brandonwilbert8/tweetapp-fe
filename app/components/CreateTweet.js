import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Page from "./Page";
import Axios from "axios";
import DispatchContext from "../DispatchContext";
import StateContext from "../StateContext";

function CreateTweet(props) {
  const username = localStorage.getItem("tweetappUsername");
  const [tweet, setTweet] = useState();
  const navigate = useNavigate();
  const appDispatch = useContext(DispatchContext);
  let x = Math.floor(Math.random() * 200 + 1);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const response = await Axios.post("http://localhost:8081/api/v1.0/tweets/${username}/add", {
        tweetId: x,
        tweet: tweet,
        username: username,
      });
      // Redirect to the new tweet page
      appDispatch({ type: "flashMessage", value: "Congratulations, you have successfully added a new tweet." });
      navigate(`/profile/${username}`);
      console.log("New tweet successfully added");
    } catch (e) {
      console.log("There was a problem");
    }
  }

  /*
  <div className="form-group">
          <label htmlFor="post-title" className="text-muted mb-1">
            <small>Title</small>
          </label>
          <input autoFocus name="title" id="post-title" className="form-control form-control-lg form-control-title" type="text" placeholder="" autoComplete="off" />
        </div>
  */

  return (
    <Page title="Create New Tweet">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="post-body" className="text-muted mb-1 d-block">
            <small>Tweet</small>
          </label>
          <textarea onChange={(e) => setTweet(e.target.value)} name="tweet" id="post-body" className="body-content tall-textarea form-control" type="text"></textarea>
        </div>
        <button className="btn btn-primary">Post Tweet</button>
      </form>
    </Page>
  );
}

export default CreateTweet;
