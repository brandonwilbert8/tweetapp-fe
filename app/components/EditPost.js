/* eslint-disable default-case */
import React, { useEffect, useState, useContext } from "react";
import Page from "./Page";
import Axios from "axios";
import { useParams, Link } from "react-router-dom";
import LoadingDotsIcon from "./LoadingDotsIcon";
import { useImmerReducer } from "use-immer";
import DispatchContext from "../DispatchContext";
import StateContext from "../StateContext";
import { useNavigate } from "react-router-dom";
import NotFound from "./NotFound";

function EditPost() {
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
          draft.tweet.message = "You must provide tweet content.";
        }
        return;
      case "notFound":
        draft.notFound = true;
        return;
    }
  }

  function submitHandler(e) {
    e.preventDefault();
    dispatch({ type: "tweetRules", value: state.tweet.value });
    dispatch({ type: "submitRequest" });
  }

  const [state, dispatch] = useImmerReducer(ourReducer, originalState);
  const appDispatch = useContext(DispatchContext);
  const appState = useContext(StateContext);
  const navigate = useNavigate();

  let { tweetId } = useParams();
  let { username } = useParams();
  //const [isLoading, setIsLoading] = useState(true);
  const [post, setPost] = useState();

  useEffect(() => {
    const ourRequest = Axios.CancelToken.source();

    async function fetchPost() {
      try {
        const response = await Axios.get(`/api/v1.0/tweets/${username}/${tweetId}`, { cancelToken: ourRequest.token });
        if (response.data) {
          dispatch({ type: "fetchComplete", value: response.data });
          if (appState.user.username !== localStorage.getItem("tweetappUsername")) {
            appDispatch({ type: "flashMessage", value: "You do not have permission to edit that post." });
            // redirect to homepage
            navigate("/");
          }
        } else {
          dispatch({ type: "notFound" });
        }
        console.log(response.data);
      } catch (e) {
        //navigate(`*`);
        console.log("There was a problem / request was cancelled");
      }
    }
    fetchPost();
    return () => {
      ourRequest.cancel();
    };
  }, []);

  useEffect(() => {
    if (state.sendCount) {
      dispatch({ type: "saveRequestStarted" });
      const ourRequest = Axios.CancelToken.source();

      async function fetchPost() {
        try {
          console.log(state);
          const response = await Axios.put(
            `/api/v1.0/tweets/${username}/update/${tweetId}`,
            {
              tweet: state.tweet.value,
            },
            { cancelToken: ourRequest.token }
          );
          dispatch({ type: "saveRequestFinished" });
          appDispatch({ type: "flashMessage", value: "Congratulations, you have successfully updated your tweet." });
          navigate(`/profile/${localStorage.getItem("tweetappUsername")}`);
          console.log(response.data);
        } catch (e) {
          console.log("There was a problem / request was cancelled");
        }
      }
      fetchPost();
      return () => {
        ourRequest.cancel();
      };
    }
  }, [state.sendCount]);

  if (!state.isFetching && state.notFound) {
    return <NotFound />;
  }

  if (state.isFetching)
    return (
      <Page title="...">
        <LoadingDotsIcon />
      </Page>
    );

  return (
    <Page title="Edit Tweet">
      <Link className="small font-weight-bold" to={`/post/${state.id}`}>
        &laquo; Back to tweets
      </Link>
      <form className="mt-3" onSubmit={submitHandler}>
        <div className="form-group">
          <label htmlFor="post-body" className="text-muted mb-1 d-block">
            <small>Tweet</small>
          </label>
          <textarea onBlur={(e) => dispatch({ type: "tweetRules", value: e.target.value })} onChange={(e) => dispatch({ type: "tweetChange", value: e.target.value })} value={state.tweet.value} name="tweet" id="post-body" className="body-content tall-textarea form-control" type="text" />
          {state.tweet.hasErrors && <div className="alert alert-danger small liveValidateMessage">{state.tweet.message}</div>}
        </div>
        <button className="btn btn-primary" disabled={state.isSaving}>
          Save Tweet
        </button>
      </form>
    </Page>
  );
}

export default EditPost;
