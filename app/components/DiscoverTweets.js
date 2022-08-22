import Axios from "axios";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import LoadingDotsIcon from "./LoadingDotsIcon";
import Page from "./Page";

function DiscoverTweets(props) {
  const [isLoading, setIsLoading] = useState(true);
  const [tweets, setTweets] = useState([]);
  const username = props.username;

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

          return (
            <Link key={tweet.username} to={`/post/${tweet.tweetId}`} className="list-group-item list-group-item-action">
              <h4>
                <strong>{tweet.tweet} </strong>{" "}
              </h4>
              <span className="text-muted">@{tweet.username}</span>
            </Link>
          );
        })}
      </div>
    </Page>
  );
}

export default DiscoverTweets;
