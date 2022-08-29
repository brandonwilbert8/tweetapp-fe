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
import { CSSTransition } from "react-transition-group";

function ReplyPost() {
  const { username, tweetId } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [post, setPost] = useState();
  const [reply, setReply] = useState();
  const navigate = useNavigate();
  const appState = useContext(StateContext);
  const appDispatch = useContext(DispatchContext);
  const currentUser = localStorage.getItem("tweetappUsername");
  let replyTweetId = Math.floor(Math.random() * 10000 + 1);

  const originalState = {
    reply: {
      value: "",
      hasErrors: false,
      message: "",
      checkCount: 0,
    },
    isFetching: true,
    isSaving: false,
    id: useParams().tweetId,
    submitCount: 0,
    notFound: false,
  };

  function ourReducer(draft, action) {
    switch (action.type) {
      case "fetchComplete":
        draft.tweet.value = action.value.tweet;
        draft.isFetching = false;
        return;
      case "replyImmediately":
        draft.reply.hasErrors = false;
        draft.reply.value = action.value;
        if (draft.reply.value.length > 144) {
          draft.reply.hasErrors = true;
          draft.reply.message = "Tweet cannot be more than 144 characters";
        }
        if (draft.reply.value.length <= 0) {
          draft.reply.hasErrors = true;
          draft.reply.message = "Tweet cannot be empty";
        }
        return;
      case "replyAfterDelay":
        if (!draft.hasErrors && !action.noRequest) {
          draft.reply.checkCount++;
        }
        return;
      case "tweetRules":
        if (!action.value.trim()) {
          draft.reply.hasErrors = true;
          draft.reply.message = "You must provide reply content.";
        }
        return;
      case "submitForm":
        if (!draft.reply.hasErrors) {
          draft.submitCount++;
        }
        return;
      case "saveRequestStarted":
        draft.isSaving = true;
        return;
      case "saveRequestFinished":
        draft.isSaving = false;
        return;
      case "notFound":
        draft.notFound = true;
        return;
    }
  }

  const [state, dispatch] = useImmerReducer(ourReducer, originalState);

  useEffect(() => {
    if (state.reply.value) {
      const delay = setTimeout(() => dispatch({ type: "tweetAfterDelay" }), 800);
      return () => clearTimeout(delay);
    }
  }, [state.reply.value]);

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

  // async function handleSubmit(e) {
  //   e.preventDefault();
  //   try {
  //     const response = await Axios.post(`http://localhost:8081/api/v1.0/tweets/${username}/reply/${tweetId}`, {
  //       tweetId: tweetId,
  //       replyTweetId: replyTweetId,
  //       replyTweet: reply,
  //       username: currentUser,
  //     });
  //     // Redirect to the new tweet page
  //     appDispatch({ type: "flashMessage", value: "Congratulations, you have successfully posted a reply!" });
  //     navigate(`/post/${tweetId}`);
  //     console.log("New reply successfully added");
  //   } catch (e) {
  //     console.log("There was a problem");
  //   }
  // }

  useEffect(() => {
    if (state.submitCount) {
      const ourRequest = Axios.CancelToken.source();

      async function postReply() {
        try {
          const response = await Axios.post(`http://localhost:8081/api/v1.0/tweets/${username}/reply/${tweetId}`, {
            tweetId: tweetId,
            replyTweetId: replyTweetId,
            replyTweet: state.reply.value,
            username: currentUser,
          });
          // Redirect to the new tweet page
          appDispatch({ type: "flashMessage", value: "Congratulations, you have successfully posted a reply!" });
          navigate(`/post/${tweetId}`);
          console.log("New reply successfully added");
        } catch (e) {
          console.log("There was a problem, cannot post a reply");
        }
      }
      postReply();
      return () => ourRequest.cancel();
    }
  }, [state.submitCount]);

  function handleSubmit(e) {
    e.preventDefault();
    dispatch({ type: "replyImmediately", value: state.reply.value });
    dispatch({ type: "submitForm" });
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
          <textarea onChange={(e) => dispatch({ type: "replyImmediately", value: e.target.value })} name="reply" id="post-body" className="body-content tall-textarea form-control" type="text" />
          <CSSTransition in={state.reply.hasErrors} timeout={330} classNames="liveValidateMessage" unmountOnExit>
            <div className="alert alert-danger small liveValidateMessage">{state.reply.message}</div>
          </CSSTransition>
        </div>
        <button className="btn btn-primary" type="submit" disabled={state.isSaving}>
          Post Reply
        </button>
      </form>
    </Page>
  );
}

export default ReplyPost;
