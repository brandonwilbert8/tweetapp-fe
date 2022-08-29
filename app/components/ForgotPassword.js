import React, { useContext, useEffect } from "react";
import Page from "./Page";
import { Link } from "react-router-dom";
import DispatchContext from "../DispatchContext";
import StateContext from "../StateContext";
import { useNavigate } from "react-router-dom";
import { useImmerReducer } from "use-immer";
import { CSSTransition } from "react-transition-group";
import Axios from "axios";

function ForgotPassword() {
  const appDispatch = useContext(DispatchContext);
  const appState = useContext(StateContext);
  const navigate = useNavigate();

  const initialState = {
    username: {
      value: "",
      hasErrors: false,
      message: "",
      isUnique: false,
      checkCount: 0,
    },
    newPassword: {
      value: "",
      hasErrors: false,
      message: "",
      checkCount: 0,
    },
    confirmNewPassword: {
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
          draft.username.hasErrors = false;
          draft.username.isUnique = true;
        } else {
          draft.username.message = "Username is not found.";
          draft.username.hasErrors = true;
        }
        return;
      case "newPasswordImmediately":
        draft.newPassword.hasErrors = false;
        draft.newPassword.value = action.value;
        if (draft.newPassword.value.length > 20) {
          draft.newPassword.hasErrors = true;
          draft.newPassword.message = "Password cannot exceed 20 characters.";
        }
        return;
      case "newPasswordAfterDelay":
        if (draft.newPassword.value.length < 4) {
          draft.newPassword.hasErrors = true;
          draft.newPassword.message = "Password must be at least 4 characters.";
        }
        return;
      case "confirmNewPasswordImmediately":
        draft.confirmNewPassword.hasErrors = false;
        draft.confirmNewPassword.value = action.value;
        if (draft.confirmNewPassword.value !== draft.newPassword.value) {
          draft.confirmNewPassword.hasErrors = true;
          draft.confirmNewPassword.message = "Password does not match";
        }
        return;
      case "confirmNewPasswordAfterDelay":
        if (!draft.confirmNewPassword.hasErrors && !action.noRequest) {
          draft.confirmNewPassword.checkCount++;
        }
        return;
      case "submitForm":
        if (!draft.username.hasErrors && draft.username.isUnique && !draft.newPassword.hasErrors && !draft.confirmNewPassword.hasErrors) {
          draft.submitCount++;
        } else {
          appDispatch({ type: "failedFlashMessage", value: "Please check all the fields" });
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
    if (state.newPassword.value) {
      const delay = setTimeout(() => dispatch({ type: "newPasswordAfterDelay" }), 800);
      return () => clearTimeout(delay);
    }
  }, [state.newPassword.value]);

  useEffect(() => {
    if (state.confirmNewPassword.value) {
      const delay = setTimeout(() => dispatch({ type: "confirmNewPasswordAfterDelay" }), 800);
      return () => clearTimeout(delay);
    }
  }, [state.confirmNewPassword.value]);

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
    if (state.submitCount) {
      const ourRequest = Axios.CancelToken.source();
      async function resetPassword() {
        try {
          const response = await Axios.put(
            `http://localhost:8081/api/v1.0/tweets/${state.username.value}/forgot`,
            {
              username: state.username.value,
              password: state.newPassword.value,
            },
            { cancelToken: ourRequest.token }
          );
          //appDispatch({ type: "login", data: response.data })
          appDispatch({ type: "logout", value: true });
          appDispatch({ type: "flashMessage", value: "Congrats! You have updated your password, please login." });
          //appState.loggedIn = false;
          navigate(`/`);
        } catch (e) {
          console.log("There was a problem or the request was cancelled.");
        }
      }
      resetPassword();
      return () => ourRequest.cancel();
    }
  }, [state.submitCount]);

  function handleSubmit(e) {
    e.preventDefault();
    dispatch({ type: "usernameImmediately", value: state.username.value });
    dispatch({ type: "usernameAfterDelay", value: state.username.value, noRequest: true });
    dispatch({ type: "newPasswordImmediately", value: state.newPassword.value });
    dispatch({ type: "newPasswordAfterDelay", value: state.newPassword.value });
    dispatch({ type: "confirmNewPasswordImmediately", value: state.confirmNewPassword.value });
    dispatch({ type: "submitForm" });
  }

  return (
    <Page title="Reset Password">
      <h2 className="text-center">Reset Password</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username-forgotpassword" className="text-muted mb-1">
            <small>Username</small>
          </label>
          <input onChange={(e) => dispatch({ type: "usernameImmediately", value: e.target.value })} id="username-forgotpassword" name="username" className="form-control" type="text" placeholder="Enter your username" autoComplete="off" />
          <CSSTransition in={state.username.hasErrors} timeout={330} classNames="liveValidateMessage" unmountOnExit>
            <div className="alert alert-danger small liveValidateMessage">{state.username.message}</div>
          </CSSTransition>
        </div>
        <div className="form-group">
          <label htmlFor="newPassword-forgotpassword" className="text-muted mb-1">
            <small>New Password</small>
          </label>
          <input onChange={(e) => dispatch({ type: "newPasswordImmediately", value: e.target.value })} id="newPassword-forgotpassword" name="newPassword" className="form-control" type="password" placeholder="Enter a new password" autoComplete="off" />
          <CSSTransition in={state.newPassword.hasErrors} timeout={330} classNames="liveValidateMessage" unmountOnExit>
            <div className="alert alert-danger small liveValidateMessage">{state.newPassword.message}</div>
          </CSSTransition>
        </div>
        <div className="form-group">
          <label htmlFor="confirmNewPassword-forgotpassword" className="text-muted mb-1">
            <small>Confirm New Password</small>
          </label>
          <input onChange={(e) => dispatch({ type: "confirmNewPasswordImmediately", value: e.target.value })} id="confirmNewPassword-forgotpassword" name="confirmNewPassword" className="form-control" type="password" placeholder="Confirm your new password" autoComplete="off" />
          <CSSTransition in={state.confirmNewPassword.hasErrors} timeout={330} classNames="liveValidateMessage" unmountOnExit>
            <div className="alert alert-danger small liveValidateMessage">{state.confirmNewPassword.message}</div>
          </CSSTransition>
        </div>
        <button className="btn btn-lg btn-block btn-success mb-3" type="submit">
          Reset Password
        </button>
      </form>
      <Link to="/">
        <button className="btn btn-lg btn-block btn-danger">Back</button>
      </Link>
    </Page>
  );
}

export default ForgotPassword;
