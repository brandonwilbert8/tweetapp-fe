/* eslint-disable default-case */
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
import { useImmerReducer } from "use-immer";

function ReplyPost() {
  const { username, tweetId } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [post, setPost] = useState();
  const [reply, setReply] = useState();
  const navigate = useNavigate();
  const appState = useContext(StateContext);
  const appDispatch = useContext(DispatchContext);
  const currentUser = localStorage.getItem("tweetappUsername");

  const originalState = {
    tweet: {
      value: "",
      hasErrors: false,
      message: "",
    },
    isFetching: true,
    isSaving: false,
    id: useParams().tweetId,
    sendCount: 0,
    notFound: false,
  };

  function ourReducer(draft, action) {
    switch (action.type) {
      case "fetchComplete":
        draft.tweet.value = action.value.tweet;
        draft.isFetching = false;
        return;
      case "tweetChange":
        draft.tweet.hasErrors = false;
        draft.tweet.value = action.value;
        return;
      case "submitRequest":
        if (!draft.tweet.hasErrors) {
          draft.sendCount++;
        }
        return;
      case "saveRequestStarted":
        draft.isSaving = true;
        return;
      case "saveRequestFinished":
        draft.isSaving = false;
        return;
      case "tweetRules":
        if (!action.value.trim()) {
          draft.tweet.hasErrors = true;
          draft.tweet.message = "You must provide reply content.";
        }
        return;
      case "notFound":
        draft.notFound = true;
        return;
    }
  }

  const [state, dispatch] = useImmerReducer(ourReducer, originalState);

  useEffect(() => {
    const ourRequest = Axios.CancelToken.source();

    async function fetchPost() {
      try {
        const response = await Axios.get(`http://localhost:8081/api/v1.0/tweets/${username}/${tweetId}`, { cancelToken: ourRequest.token });
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

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const response = await Axios.post("http://localhost:8081/api/v1.0/tweets/${username}/reply/${tweetId}", {});
      // Redirect to the new tweet page
      appDispatch({ type: "flashMessage", value: "Congratulations, you have successfully added a new tweet." });
      navigate(`/profile/${username}`);
      console.log("New tweet successfully added");
    } catch (e) {
      console.log("There was a problem");
    }
  }

  if (!isLoading && !post) {
    return <NotFound />;
  }

  if (isLoading)
    return (
      <Page title="...">
        <LoadingDotsIcon />
      </Page>
    );

  return (
    <Page title={post.tweetId}>
      <div className="d-flex justify-content-between">
        <h2>Tweet ID: {post.tweetId}</h2>
      </div>

      <p className="text-muted small mb-4">
        Posted by <Link to={`/profile/${post.username}/`}>{post.username}</Link>
      </p>

      <div className="body-content">
        <ReactMarkdown children={post.tweet} allowedElements={["p", "br", "strong", "em", "h1", "h2", "h3", "h4", "h5", "h6", "ul", "ol", "li"]} />
      </div>

      <form className="mt-3" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="post-body" className="text-muted mb-1 d-block">
            <small>Reply</small>
          </label>
          <textarea onChange={(e) => setReply(e.target.value)} name="tweet" id="post-body" className="body-content tall-textarea form-control" type="text" />
          {state.tweet.hasErrors && <div className="alert alert-danger small liveValidateMessage">{state.tweet.message}</div>}
        </div>
        <button className="btn btn-primary" disabled={state.isSaving}>
          Save Reply
        </button>
      </form>
    </Page>
  );
}

export default ReplyPost;
