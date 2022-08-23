import Axios from "axios";
import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import LoadingDotsIcon from "./LoadingDotsIcon";
import Page from "./Page";
import StateContext from "../StateContext";
import ReactTooltip from "react-tooltip";
import DispatchContext from "../DispatchContext";

function DiscoverTweets(props) {
  const [isLoading, setIsLoading] = useState(true);
  const [tweets, setTweets] = useState([]);
  const appState = useContext(StateContext);
  const appDispatch = useContext(DispatchContext);
  const navigate = useNavigate();
  const currentUser = localStorage.getItem("tweetappUsername");
  const { username, tweetId } = useParams();

  useEffect(() => {
    async function fetchAllTweets() {
      try {
        const response = await Axios.get(`http://localhost:8081/api/v1.0/tweets/all`);
        setTweets(response.data);
        console.log(response.data);
        setIsLoading(false);
      } catch (e) {
        console.log("There was a problem");
      }
    }
    fetchAllTweets();
  }, []);

  if (isLoading) {
    return <LoadingDotsIcon />;
  }

  const likeTweet = (e) => {
    e.preventDefault();
    console.log("Clicked!");
  };

  return (
    <Page title="All Tweets">
      <div className="profile-nav nav nav-tabs pt-1 mb-4">
        <Link to={`/discovertweets`} className="active nav-item active">
          <h3>Tweets</h3>
        </Link>
      </div>

      <div className="list-group">
        {tweets.map((tweet) => {
          const date = new Date(tweet.createdDate);
          const dateFormatted = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;

          function isOwner() {
            if (appState.loggedIn) {
              return currentUser === tweet.username;
            }
            return false;
          }

          return (
            <Link key={tweet.username} to={`/post/${tweet.tweetId}`} className="list-group-item list-group-item-action">
              {isOwner() ? (
                <h5>
                  <strong>{tweet.tweet}</strong>{" "}
                </h5>
              ) : (
                <h5>
                  <strong>{tweet.tweet}</strong> <p className="text-muted small">Tweet ID: {tweet.tweetId}</p>
                  <div className="d-flex justify-content-sm-end ">
                    <div data-tip="Like Tweet" data-for="like" className="text-primary mr-2">
                      <button onClick={likeTweet} className="far fa-thumbs-up"></button>
                    </div>
                    <ReactTooltip id="like" className="custom-tooltip" />{" "}
                    <Link to={`/post/${tweet.tweetId}/reply`} data-tip="Reply to this Tweet" data-for="reply" className="text-success mr-2">
                      <i className="fas fa-reply"></i>
                    </Link>
                    <ReactTooltip id="reply" className="custom-tooltip" />
                  </div>
                </h5>
              )}
              <span className="text-muted small">@{tweet.username}</span>
            </Link>
          );
        })}
      </div>
    </Page>
  );
}

export default DiscoverTweets;
