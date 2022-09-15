import React, { useEffect, useState, useContext } from "react";
import Page from "./Page";
import Axios from "axios";
import { useParams, Link, useNavigate } from "react-router-dom";
import LoadingDotsIcon from "./LoadingDotsIcon";
import ReactMarkdown from "react-markdown";
import ReactTooltip from "react-tooltip";
import NotFound from "./NotFound";
import StateContext from "../StateContext";
import DispatchContext from "../DispatchContext";

function DisplayReplies() {
  const { username, tweetId } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [post, setPost] = useState();
  const navigate = useNavigate();
  const appState = useContext(StateContext);
  const appDispatch = useContext(DispatchContext);
  const currentUser = localStorage.getItem("tweetappUsername");
  const [like, setLike] = useState();

  useEffect(() => {
    const ourRequest = Axios.CancelToken.source();

    async function fetchPost() {
      try {
        const response = await Axios.get(`/api/v1.0/tweets/${username}/${tweetId}`, { cancelToken: ourRequest.token });
        setPost(response.data);
        setIsLoading(false);
        console.log(response.data);
      } catch (e) {
        navigate("*");
        console.log("There was a problem / request was cancelled");
      }
    }
    fetchPost();
    return () => {
      ourRequest.cancel();
    };
  }, []);

  if (!isLoading && !post) {
    return <NotFound />;
  }

  if (isLoading)
    return (
      <Page title="...">
        <LoadingDotsIcon />
      </Page>
    );

  function isOwner() {
    if (appState.loggedIn) {
      return currentUser === post.username;
    }
    return false;
  }

  function isLiked() {
    if (!post.like) {
      return false;
    }
    if (post.like.details.includes(currentUser)) {
      return true;
    }
    return false;
  }

  async function deleteHandler() {
    const areYouSure = window.confirm("Do you really want to delete this tweet?");
    if (areYouSure) {
      try {
        const response = await Axios.delete(`/api/v1.0/tweets/${username}/delete/${tweetId}`);
        if (response.data) {
          // 1. display a flash message
          appDispatch({ type: "flashMessage", value: "Post was successfully deleted" });
          // 2. redirect back to the profie page
          navigate(`/profile/${localStorage.getItem("tweetappUsername")}`);
        }
      } catch (e) {
        console.log("There was a problem, could not delete.");
      }
    }
  }

  async function likeHandler() {
    try {
      const response = await Axios.put(`/api/v1.0/tweets/${currentUser}/like/${tweetId}`);
      if (response.data) {
        // 1. display a flash message
        appDispatch({ type: "flashMessage", value: "Liked a tweet" });
        window.location.reload();
      }
    } catch (e) {
      console.log("There was a problem, could not like.");
    }
  }

  async function unlikeHandler() {
    try {
      const response = await Axios.put(`/api/v1.0/tweets/${currentUser}/unlike/${tweetId}`);
      if (response.data) {
        // 1. display a flash message
        appDispatch({ type: "flashMessage", value: "Unliked a tweet" });
        window.location.reload();
      }
    } catch (e) {
      console.log("There was a problem, could not perform unlike.");
    }
  }

  // Rendering objects from replies - Getting replies from 1 tweet
  function renderingReplies() {
    const renderedReplies = post.replies.map((element) => {
      return (
        <tr>
          <td
            style={{
              fontWeight: "bold",
              color: "red",
            }}
          >
            @{element.username}
          </td>
          <td
            style={{
              fontStyle: "italic",
              color: "blue",
            }}
          >
            {element.replyTweet}
          </td>
          <td
            style={{
              fontStyle: "italic",
              color: "green",
            }}
          >
            {element.postedReplyDate} -
          </td>
          <td
            style={{
              fontStyle: "italic",
              color: "green",
            }}
          >
            {element.postedReplyTime}
          </td>
          {element.tag ? (
            <td
              style={{
                fontStyle: "italic",
                color: "purple",
              }}
            >
              #{element.tag}
            </td>
          ) : (
            ""
          )}
        </tr>
      );
    });
    return <div>{renderedReplies}</div>;
  }

  return (
    <Page title={post.tweetId}>
      <div className="d-flex justify-content-between">
        <h6>Tweet ID: {post.tweetId}</h6>
        {isOwner() ? ( // If this is the owner of the tweet, then do:
          <span className="pt-2">
            {isLiked() ? (
              <a onClick={unlikeHandler} data-tip="Unlike Tweet" data-for="like" className="text-primary mr-2">
                <i className="fas fa-thumbs-up"></i>
              </a>
            ) : (
              <a onClick={likeHandler} data-tip="Like Tweet" data-for="like" className="text-primary mr-2">
                <i className="far fa-thumbs-up"></i>
              </a>
            )}
            <ReactTooltip id="like" className="custom-tooltip" />{" "}
            <Link to={`/post/${post.tweetId}/reply`} data-tip="Reply to this Tweet" data-for="reply" className="text-success mr-2">
              <i className="fas fa-reply"></i>
            </Link>
            <ReactTooltip id="reply" className="custom-tooltip" />{" "}
            <Link to={`/post/${post.tweetId}/edit`} data-tip="Update Tweet" data-for="edit" className="text-primary mr-2">
              <i className="fas fa-edit"></i>
            </Link>
            <ReactTooltip id="edit" className="custom-tooltip" />{" "}
            <a onClick={deleteHandler} data-tip="Delete Tweet" data-for="delete" className="delete-post-button text-danger mr-2">
              <i className="fas fa-trash"></i>
            </a>
            <ReactTooltip id="delete" className="custom-tooltip" />
          </span>
        ) : (
          // If NOT the owner of the tweet, then do
          <span className="pt-2">
            <Link to={`/post/${post.tweetId}/edit`} data-tip="Like Tweet" data-for="like" className="text-primary mr-2">
              <i className="far fa-thumbs-up"></i>
            </Link>
            <ReactTooltip id="like" className="custom-tooltip" />{" "}
            <Link to={`/post/${post.tweetId}/reply`} data-tip="Reply to this Tweet" data-for="reply" className="text-success">
              <i className="fas fa-reply"></i>
            </Link>
            <ReactTooltip id="reply" className="custom-tooltip" />
          </span>
        )}
      </div>

      <p className="text-muted small">
        Posted by <Link to={`/profile/${post.username}/`}>{post.username}</Link>
      </p>

      {/*{post.like ? <p className="text-muted small">Likes:{post.like.noOfLikes}</p> : <p className="text-muted small">Likes: 0</p>} */}

      {/* {post.replies ? <p className="text-muted small">Replies: {post.replies.length}</p> : <p className="text-muted small">Replies: 0</p>} */}

      <div className="body-content">
        <ReactMarkdown children={post.tweet} allowedElements={["p", "br", "strong", "em", "h1", "h2", "h3", "h4", "h5", "h6", "ul", "ol", "li"]} />
      </div>

      <div className="text-muted small">
        Posted on: {post.postedTweetDate} - {post.postedTweetTime}
      </div>

      {renderingReplies()}

      <Link to={`/post/${post.tweetId}`}>
        <button className="btn btn-sm btn-danger bi-align-right">Back</button>
      </Link>
    </Page>
  );
}

export default DisplayReplies;
