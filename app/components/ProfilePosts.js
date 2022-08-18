import Axios from "axios";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import LoadingDotsIcon from "./LoadingDotsIcon";

function ProfilePosts(props) {
  //const username = localStorage.getItem("tweetappUsername");
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
          <Link key={post.tweetId} to={`/post/${post.tweetId}`} className="list-group-item list-group-item-action">
            <strong>{post.tweet}</strong> <span className="text-muted small"></span>
          </Link>
        );
      })}
    </div>
  );
}

export default ProfilePosts;
