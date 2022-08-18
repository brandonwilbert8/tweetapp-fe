import React, { useEffect, useContext, useState } from "react";
import Page from "./Page";
import ProfilePosts from "./ProfilePosts";
import Axios from "axios";
import { useParams } from "react-router-dom";
import StateContext from "../StateContext";
import { Link } from "react-router-dom";

function Profile() {
  //const username = localStorage.getItem("tweetappUsername");
  const { username } = useParams();
  const appState = useContext(StateContext);
  const [profileData, setProfileData] = useState({
    counts: { postCount: "" },
  });

  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await Axios.get(`http://localhost:8081/api/v1.0/tweets/${username}/`);
        setProfileData(response.data);
        console.log(response.data);
      } catch (e) {
        console.log("There was a problem");
      }
    }
    fetchPosts();
  }, []);

  return (
    <Page title="Profile Screen">
      <h1>
        <img className="avatar avatar-16 bg-light rounded-circle text-white p-4" src="https://raw.githubusercontent.com/twbs/icons/main/icons/person-fill.svg" /> {username}
      </h1>

      <div className="profile-nav nav nav-tabs pt-2 mb-4">
        <Link to={`/profile/${username}`} className="active nav-item nav-link">
          Tweets
        </Link>
      </div>
      <ProfilePosts />
    </Page>
  );
}

export default Profile;