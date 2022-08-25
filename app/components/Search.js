import React, { useContext, useEffect, useState } from "react";
import DispatchContext from "../DispatchContext";
import { useImmer } from "use-immer";
import Axios from "axios";
import { Link } from "react-router-dom";

function Search() {
  const appDispatch = useContext(DispatchContext);

  const [state, setState] = useImmer({
    searchTerm: "",
    results: [],
    show: "neither",
    requestCount: 0,
  });

  useEffect(() => {
    document.addEventListener("keyup", searchKeyPressHandler);
    return () => document.removeEventListener("keyup", searchKeyPressHandler);
  }, []);

  useEffect(() => {
    if (state.searchTerm.trim()) {
      setState((draft) => {
        draft.show = "loading";
      });
      const delay = setTimeout(() => {
        setState((draft) => {
          draft.requestCount++;
        });
      }, 750);

      return () => clearTimeout(delay);
    } else {
      setState((draft) => {
        draft.show = "neither";
      });
    }
  }, [setState, state.searchTerm]);

  useEffect(() => {
    if (state.requestCount) {
      // Send axios request here
      const ourRequest = Axios.CancelToken.source();

      async function fetchResults() {
        try {
          const response = await Axios.get(`http://localhost:8081/api/v1.0/tweets/user/search/${state.searchTerm}`, { cancelToken: ourRequest.token });
          console.log(response.data);
          setState((draft) => {
            draft.results = response.data;
            draft.show = "results";
          });
        } catch (e) {
          console.log("There was a problem or the request was cancelled");
        }
      }
      fetchResults();
      return () => ourRequest.cancel();
    }
  }, [state.requestCount]);

  // Function that will make "esc" key close the search bar
  function searchKeyPressHandler(e) {
    if (e.keyCode === 27) {
      appDispatch({ type: "closeSearch" });
    }
  }

  function handleInput(e) {
    const setSearchUser = e.target.value;
    console.log(setSearchUser);
    setState((draft) => {
      draft.searchTerm = setSearchUser;
    });
  }

  return (
    <div className="search-overlay">
      <div className="search-overlay-top shadow-sm">
        <div className="container container--narrow">
          <label htmlFor="live-search-field" className="search-overlay-icon">
            <i className="fas fa-search"></i>
          </label>
          <input onChange={handleInput} autoFocus type="text" autoComplete="off" id="live-search-field" className="live-search-field" placeholder="What are you interested in?" />
          <span onClick={() => appDispatch({ type: "closeSearch" })} className="close-live-search">
            <i className="fas fa-times-circle"></i>
          </span>
        </div>
      </div>

      <div className="search-overlay-bottom">
        <div className="container container--narrow py-3">
          <div className={"circle-loader " + (state.show === "loading" ? "circle-loader--visible" : "")}></div>
          <div className={"live-search-results " + (state.show === "results" ? "live-search-results--visible" : "")}>
            {Boolean(state.results.length) && (
              <div className="list-group shadow-sm">
                <div className="list-group-item active">
                  <strong>Search Results</strong> ({state.results.length} {state.results.length > 1 ? "items" : "item"} found)
                </div>
                {state.results.map((post) => {
                  const date = new Date(post.createdDate);
                  const dateFormatted = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;

                  return (
                    <Link onClick={() => appDispatch({ type: "closeSearch" })} key={post.tweetId} to={`/profile/${post.username}`} className="list-group-item list-group-item-action">
                      <strong>{post.tweet}</strong> <span className="text-muted">{post.username}</span>
                    </Link>
                  );
                })}
              </div>
            )}
            {!Boolean(state.results.length) && <p className="alert alert-danger text-center shadow-sm">Sorry, we could not find any results for that search.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Search;
