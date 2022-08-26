import React, { useState, useContext, useEffect } from "react";
import Page from "./Page";
import Axios from "axios";
import DispatchContext from "../DispatchContext";
import StateContext from "../StateContext";
import { useNavigate } from "react-router-dom";
import { useImmerReducer } from "use-immer";
import { CSSTransition } from "react-transition-group";

function HomeGuest() {
  const appDispatch = useContext(DispatchContext);
  const appState = useContext(StateContext);
  const navigate = useNavigate();

  const initialState = {
    firstName: {
      value: "",
      hasErrors: false,
      message: "",
      checkCount: 0,
    },
    lastName: {
      value: "",
      hasErrors: false,
      message: "",
      checkCount: 0,
    },
    username: {
      value: "",
      hasErrors: false,
      message: "",
      isUnique: false,
      checkCount: 0,
    },
    email: {
      value: "",
      hasErrors: false,
      message: "",
      isUnique: false,
      checkCount: 0,
    },
    password: {
      value: "",
      hasErrors: false,
      message: "",
    },
    contactNumber: {
      value: "",
      hasErrors: false,
      message: "",
      checkCount: 0,
    },
    submitCount: 0,
  };

  function ourReducer(draft, action) {
    // eslint-disable-next-line default-case
    switch (action.type) {
      case "firstNameImmediately":
        draft.firstName.hasErrors = false;
        draft.firstName.value = action.value;
        return;
      case "firstNameAfterDelay":
        return;
      case "lastNameImmediately":
        draft.lastName.hasErrors = false;
        draft.lastName.value = action.value;
        return;
      case "lastNameAfterDelay":
        return;
      case "usernameImmediately":
        draft.username.hasErrors = false;
        draft.username.value = action.value;
        if (draft.username.value.length > 30) {
          draft.username.hasErrors = true;
          draft.username.message = "Username cannot exceed 30 characters.";
        }
        if (draft.username.value && !/^([a-zA-Z0-9]+)$/.test(draft.username.value)) {
          draft.username.hasErrors = true;
          draft.username.message = "Username can only contain letters and numbers.";
        }
        return;
      case "usernameAfterDelay":
        if (draft.username.value.length < 3) {
          draft.username.hasErrors = true;
          draft.username.message = "Username must be at least 3 characters long.";
        }
        if (!draft.hasErrors && !action.noRequest) {
          draft.username.checkCount++;
        }
        return;
      case "usernameUniqueResults":
        if (action.value) {
          draft.username.hasErrors = true;
          draft.username.isUnique = false;
          draft.username.message = "That username is already taken.";
        } else {
          draft.username.isUnique = true;
        }
        return;
      case "emailImmediately":
        draft.email.hasErrors = false;
        draft.email.value = action.value;
        return;
      case "emailAfterDelay":
        if (!/^\S+@\S+$/.test(draft.email.value)) {
          draft.email.hasErrors = true;
          draft.email.message = "You must provide a valid email address.";
        }
        if (!draft.email.hasErrors && !action.noRequest) {
          draft.email.checkCount++;
        }
        return;
      case "emailUniqueResults":
        if (action.value) {
          draft.email.hasErrors = true;
          draft.email.isUnique = false;
          draft.email.message = "That email is already being used.";
        } else {
          draft.email.isUnique = true;
        }
        return;
      case "passwordImmediately":
        draft.password.hasErrors = false;
        draft.password.value = action.value;
        if (draft.password.value.length > 20) {
          draft.password.hasErrors = true;
          draft.password.message = "Password cannot exceed 20 characters.";
        }
        return;
      case "passwordAfterDelay":
        if (draft.password.value.length < 4) {
          draft.password.hasErrors = true;
          draft.password.message = "Password must be at least 4 characters.";
        }
        return;
      case "contactNumberImmediately":
        draft.contactNumber.hasErrors = false;
        draft.contactNumber.value = action.value;
        if (draft.contactNumber.value.length > 10) {
          draft.contactNumber.hasErrors = true;
          draft.contactNumber.message = "Contact Number cannot exceed 10 characters long.";
        }
        if (draft.contactNumber.value && !/^([0-9]+)$/.test(draft.contactNumber.value)) {
          draft.contactNumber.hasErrors = true;
          draft.contactNumber.message = "Contact Number can only contain numbers.";
        }
        return;
      case "contactNumberAfterDelay":
        return;
      case "submitForm":
        if (!draft.firstName.hasErrors && !draft.lastName.hasErrors && !draft.username.hasErrors && draft.username.isUnique && !draft.email.hasErrors && draft.email.isUnique && !draft.password.hasErrors && !draft.contactNumber.hasErrors) {
          draft.submitCount++;
        }
        return;
    }
  }

  const [state, dispatch] = useImmerReducer(ourReducer, initialState);

  useEffect(() => {
    if (state.username.value) {
      const delay = setTimeout(() => dispatch({ type: "usernameAfterDelay" }), 800);
      return () => clearTimeout(delay);
    }
  }, [state.username.value]);

  useEffect(() => {
    if (state.email.value) {
      const delay = setTimeout(() => dispatch({ type: "emailAfterDelay" }), 800);
      return () => clearTimeout(delay);
    }
  }, [state.email.value]);

  useEffect(() => {
    if (state.password.value) {
      const delay = setTimeout(() => dispatch({ type: "passwordAfterDelay" }), 800);
      return () => clearTimeout(delay);
    }
  }, [state.password.value]);

  useEffect(() => {
    if (state.username.checkCount) {
      // Send axios request here
      const ourRequest = Axios.CancelToken.source();

      async function fetchResults() {
        try {
          const response = await Axios.get(`http://localhost:8081/api/v1.0/tweets/user/check/${state.username.value}`, { cancelToken: ourRequest.token });
          dispatch({ type: "usernameUniqueResults", value: response.data });
          console.log(response.data);
        } catch (e) {
          console.log("There was a problem or the request was cancelled");
        }
      }
      fetchResults();
      return () => ourRequest.cancel();
    }
  }, [state.username.checkCount]);

  useEffect(() => {
    if (state.email.checkCount) {
      const ourRequest = Axios.CancelToken.source();
      async function fetchResults() {
        try {
          const response = await Axios.get(`http://localhost:8081/api/v1.0/tweets/user/email/${state.email.value}`, { cancelToken: ourRequest.token });
          dispatch({ type: "emailUniqueResults", value: response.data });
        } catch (e) {
          console.log("There was a problem or the request was cancelled.");
        }
      }
      fetchResults();
      return () => ourRequest.cancel();
    }
  }, [state.email.checkCount]);

  useEffect(() => {
    if (state.submitCount) {
      const ourRequest = Axios.CancelToken.source();
      async function fetchResults() {
        try {
          const response = await Axios.post(
            "http://localhost:8081/api/v1.0/tweets/register",
            {
              firstName: state.firstName.value,
              lastName: state.lastName.value,
              email: state.email.value,
              username: state.username.value,
              password: state.password.value,
              contactNumber: state.contactNumber.value,
            },
            { cancelToken: ourRequest.token }
          );
          //appDispatch({ type: "login", data: response.data })
          appDispatch({ type: "logout", value: true });
          appDispatch({ type: "flashMessage", value: "Congrats! Welcome to your new account." });
          appState.loggedIn = false;
          navigate(`/afterregister`);
        } catch (e) {
          console.log("There was a problem or the request was cancelled.");
        }
      }
      fetchResults();
      return () => ourRequest.cancel();
    }
  }, [state.submitCount]);

  function handleSubmit(e) {
    e.preventDefault();
    dispatch({ type: "firstNameImmediately", value: state.firstName.value });
    dispatch({ type: "lastNameImmediately", value: state.lastName.value });
    dispatch({ type: "emailImmediately", value: state.email.value });
    dispatch({ type: "emailAfterDelay", value: state.email.value, noRequest: true });
    dispatch({ type: "usernameImmediately", value: state.username.value });
    dispatch({ type: "usernameAfterDelay", value: state.username.value, noRequest: true });
    dispatch({ type: "passwordImmediately", value: state.password.value });
    dispatch({ type: "passwordAfterDelay", value: state.password.value });
    dispatch({ type: "contactNumberImmediately", value: state.contactNumber.value });
    dispatch({ type: "contactNumberAfterDelay", value: state.contactNumber.value });
    dispatch({ type: "submitForm" });
  }

  // const [firstName, setFirstName] = useState();
  // const [lastName, setLastName] = useState();
  // const [email, setEmail] = useState();
  // const [username, setUsername] = useState();
  // const [password, setPassword] = useState();
  // const [contactNumber, setContactNumber] = useState();

  // const appDispatch = useContext(DispatchContext);
  // const appState = useContext(StateContext);
  // const navigate = useNavigate();

  // async function handleSubmit(e) {
  //   e.preventDefault();
  //   try {
  //     await Axios.post("http://localhost:8081/api/v1.0/tweets/register", {
  //       firstName: firstName,
  //       lastName: lastName,
  //       email: email,
  //       username: username,
  //       password: password,
  //       contactNumber: contactNumber,
  //     });
  //     //localStorage.setItem("tweetappUsername", username);
  //     console.log("User was successfully registered");
  //     appDispatch({ type: "flashMessage", value: "Congratulations, you have successfully created a new user." });
  //     appDispatch({ type: "logout", value: true });
  //     appState.loggedIn = false;
  //     navigate(`/afterregister`);
  //   } catch (error) {
  //     console.log("There was an error");
  //   }
  // }

  return (
    <Page title="Welcome!" wide={true}>
      <div className="row align-items-center">
        <div className="col-lg-7 py-3 py-md-5">
          <h1 className="display-3">TweetApp</h1>
          <p className="lead text-muted">Happening now. Join TweetApp today.</p>
        </div>
        <div className="col-lg-5 pl-lg-5 pb-3 py-lg-5">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="firstname-register" className="text-muted mb-1">
                <small>First Name</small>
              </label>
              <input onChange={(e) => dispatch({ type: "firstNameImmediately", value: e.target.value })} id="firstname-register" name="firstName" className="form-control" type="text" placeholder="First Name" autoComplete="off" />
            </div>
            <div className="form-group">
              <label htmlFor="lastname-register" className="text-muted mb-1">
                <small>Last Name</small>
              </label>
              <input onChange={(e) => dispatch({ type: "lastNameImmediately", value: e.target.value })} id="lastname-register" name="lastName" className="form-control" type="text" placeholder="Last Name" autoComplete="off" />
            </div>
            <div className="form-group">
              <label htmlFor="email-register" className="text-muted mb-1">
                <small>Email</small>
              </label>
              <input onChange={(e) => dispatch({ type: "emailImmediately", value: e.target.value })} id="email-register" name="email" className="form-control" type="email" placeholder="you@example.com" autoComplete="off" />
              <CSSTransition in={state.email.hasErrors} timeout={330} classNames="liveValidateMessage" unmountOnExit>
                <div className="alert alert-danger small liveValidateMessage">{state.email.message}</div>
              </CSSTransition>
            </div>
            <div className="form-group">
              <label htmlFor="username-register" className="text-muted mb-1">
                <small>Username</small>
              </label>
              <input onChange={(e) => dispatch({ type: "usernameImmediately", value: e.target.value })} id="username-register" name="username" className="form-control" type="text" placeholder="Pick a username" autoComplete="off" />
              <CSSTransition in={state.username.hasErrors} timeout={330} classNames="liveValidateMessage" unmountOnExit>
                <div className="alert alert-danger small liveValidateMessage">{state.username.message}</div>
              </CSSTransition>
            </div>
            <div className="form-group">
              <label htmlFor="password-register" className="text-muted mb-1">
                <small>Password</small>
              </label>
              <input onChange={(e) => dispatch({ type: "passwordImmediately", value: e.target.value })} id="password-register" name="password" className="form-control" type="password" placeholder="Create a password" />
              <CSSTransition in={state.password.hasErrors} timeout={330} classNames="liveValidateMessage" unmountOnExit>
                <div className="alert alert-danger small liveValidateMessage">{state.password.message}</div>
              </CSSTransition>
            </div>
            <div className="form-group">
              <label htmlFor="contactNumber-register" className="text-muted mb-1">
                <small>Contact Number</small>
              </label>
              <input onChange={(e) => dispatch({ type: "contactNumberImmediately", value: e.target.value })} id="contactNumber-register" name="contactNumber" className="form-control" type="text" placeholder="Enter a contact number" />
              <CSSTransition in={state.contactNumber.hasErrors} timeout={330} classNames="liveValidateMessage" unmountOnExit>
                <div className="alert alert-danger small liveValidateMessage">{state.contactNumber.message}</div>
              </CSSTransition>
            </div>
            <button type="submit" className="py-3 mt-4 btn btn-lg btn-success btn-block">
              Sign up for TweetApp
            </button>
          </form>
        </div>
      </div>
    </Page>
  );
}

export default HomeGuest;
