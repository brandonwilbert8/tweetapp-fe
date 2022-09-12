import Axios from "axios";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import LoadingDotsIcon from "./LoadingDotsIcon";
import ReactTooltip from "react-tooltip";

function ProfilePosts(props) {
  const currentUser = localStorage.getItem("tweetappUsername");
  const { username } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await Axios.get(`http://localhost:8081/api/v1.0/tweets/${username}/`);
        setPosts(response.data);
        console.log(response.data);
        setIsLoading(false);
      } catch (e) {
        console.log("There was a problem");
      }
    }
    fetchPosts();
  }, []);

  if (isLoading) {
    return <LoadingDotsIcon />;
  }

  return (
    <div className="list-group">
      {posts.map((post) => {
        const date = new Date(post.createdDate);
        const dateFormatted = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;

        return (
          <Link key={post.tweetId} to={`/post/${post.tweetId}`} className="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
            <strong>{post.tweet}</strong>
            <span className="text-info small font-weight-light">{post.postedTweetDate} - {post.postedTweetTime}</span>
            {/* <div className="d-flex justify-content-end ">
              <Link to={`/post/${post.tweetId}/edit`} data-tip="Like Tweet" data-for="like" className="text-primary mr-2">
                <i className="far fa-thumbs-up"></i>
              </Link>
              <ReactTooltip id="like" className="custom-tooltip" />{" "}
              <Link to={`/post/${post.tweetId}/reply`} data-tip="Reply to this Tweet" data-for="reply" className="text-success mr-2">
                <i className="fas fa-reply"></i>
              </Link>
              <ReactTooltip id="reply" className="custom-tooltip" />
            </div> */}
          </Link>
        );
      })}
    </div>
  );
}

export default ProfilePosts;
