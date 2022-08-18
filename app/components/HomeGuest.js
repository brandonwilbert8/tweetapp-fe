import React, { useState } from "react";
import Page from "./Page";
import Axios from "axios";

function HomeGuest() {
  const [firstName, setFirstName] = useState();
  const [lastName, setLastName] = useState();
  const [email, setEmail] = useState();
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await Axios.post("http://localhost:8081/api/v1.0/tweets/register", {
        firstName: firstName,
        lastName: lastName,
        email: email,
        username: username,
        password: password,
      });
      console.log("User was successfully registered");
    } catch (error) {
      console.log("There was an error");
    }
  }

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
              <input onChange={(e) => setFirstName(e.target.value)} id="firstname-register" name="firstName" className="form-control" type="text" placeholder="First Name" autoComplete="off" />
            </div>
            <div className="form-group">
              <label htmlFor="lastname-register" className="text-muted mb-1">
                <small>Last Name</small>
              </label>
              <input onChange={(e) => setLastName(e.target.value)} id="lastname-register" name="lastName" className="form-control" type="text" placeholder="Last Name" autoComplete="off" />
            </div>
            <div className="form-group">
              <label htmlFor="email-register" className="text-muted mb-1">
                <small>Email</small>
              </label>
              <input onChange={(e) => setEmail(e.target.value)} id="email-register" name="email" className="form-control" type="text" placeholder="you@example.com" autoComplete="off" />
            </div>
            <div className="form-group">
              <label htmlFor="username-register" className="text-muted mb-1">
                <small>Username</small>
              </label>
              <input onChange={(e) => setUsername(e.target.value)} id="username-register" name="username" className="form-control" type="text" placeholder="Pick a username" autoComplete="off" />
            </div>
            <div className="form-group">
              <label htmlFor="password-register" className="text-muted mb-1">
                <small>Password</small>
              </label>
              <input onChange={(e) => setPassword(e.target.value)} id="password-register" name="password" className="form-control" type="password" placeholder="Create a password" />
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
