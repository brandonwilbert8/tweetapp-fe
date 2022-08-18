/* eslint-disable no-fallthrough */
import React, { useState, useReducer, useEffect } from "react";
import ReactDOM from "react-dom/client";
import { useImmerReducer } from "use-immer";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import StateContext from "./StateContext";
import DispatchContext from "./DispatchContext";

// My Components
import Header from "./components/Header";
import HomeGuest from "./components/HomeGuest";
import Footer from "./components/Footer";
import About from "./components/About";
import Terms from "./components/Terms";
import Home from "./components/Home";
import CreateTweet from "./components/CreateTweet";
import ViewSinglePost from "./components/ViewSinglePost";
import FlashMessages from "./components/FlashMessages";
import Profile from "./components/Profile";
import EditPost from "./components/EditPost";
import NotFound from "./components/NotFound";
import AllUsers from "./components/AllUsers";
import DiscoverTweets from "./components/DiscoverTweets";

function Main() {
  const initialState = {
    loggedIn: Boolean(localStorage.getItem("tweetappUsername")),
    flashMessages: [],
    /*
    user: {
      username: localStorage.getItem("tweetappUsername"),
      password: localStorage.getItem("tweetappPassword"),
    },*/
  };

  function ourReducer(draft, action) {
    // eslint-disable-next-line default-case
    switch (action.type) {
      case "login":
        draft.loggedIn = true;
        // draft.user = action.data;
        return;
      case "logout":
        draft.loggedIn = false;
        return;
      case "flashMessage":
        draft.flashMessages.push(action.value);
        return;
    }
  }

  const [state, dispatch] = useImmerReducer(ourReducer, initialState);

  /*
  useEffect(() => {
    if (state.loggedIn) {
      localStorage.setItem("tweetappUsername", state.username);
      localStorage.setItem("tweetappPassword", state.password);
    } else {
      localStorage.removeItem("tweetappUsername");
      localStorage.removeItem("tweetappPassword");
    }
  }, [state.loggedIn]);
  */

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        <BrowserRouter>
          <FlashMessages messages={state.flashMessages} />
          <Header loggedIn={state.loggedIn} />
          <Routes>
            <Route path="/" element={state.loggedIn ? <Home /> : <HomeGuest />} />
            <Route path="/profile/:username/*" element={<Profile />} />
            <Route path="/create-post" element={<CreateTweet />} />
            <Route path="/post/:tweetId/edit" element={<EditPost />} />
            <Route path="/post/:tweetId" element={<ViewSinglePost />} />
            <Route path="/about-us" element={<About />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="*" element={<NotFound />} />
            <Route path="/allusers" element={<AllUsers />} />
            <Route path="/discovertweets" element={<DiscoverTweets />} />
          </Routes>
          <Footer />
        </BrowserRouter>
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
}

const root = ReactDOM.createRoot(document.querySelector("#app"));
root.render(<Main />);

if (module.hot) {
  module.hot.accept();
}
