import Axios from "axios";
import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import LoadingDotsIcon from "./LoadingDotsIcon";
import Page from "./Page";
import ReactTooltip from "react-tooltip";
import DispatchContext from "../DispatchContext";

function AllUsers(props) {
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const appDispatch = useContext(DispatchContext);
  const username = props.username;

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await Axios.get(`http://localhost:8081/api/v1.0/tweets/users/all/`);
        setUsers(response.data);
        console.log(response.data);
        setIsLoading(false);
      } catch (e) {
        console.log("There was a problem");
      }
    }
    fetchUsers();
  }, []);

  if (isLoading) {
    return <LoadingDotsIcon />;
  }

  function handleSearchIcon(e) {
    e.preventDefault();
    appDispatch({ type: "openSearch" });
  }

  return (
    <Page title="All Users">
      {/* Search Button below: */}
      <div className="d-flex justify-content-sm-end ">
        <div onClick={handleSearchIcon} data-tip="Search Available Users" data-for="search" className="text-primary mr-2">
          <button className="fas fa-search fa-2x"></button>
        </div>
        <ReactTooltip place="bottom" id="search" className="custom-tooltip" />{" "}
      </div>
      <div className="profile-nav nav nav-tabs pt-1 mb-4">
        <Link to={`/allusers`} className="active nav-item active">
          <h3>Users</h3>
        </Link>
      </div>

      <div className="list-group">
        {users.map((user) => {
          const date = new Date(user.createdDate);
          const dateFormatted = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;

          return (
            <Link key={user.username} to={`/profile/${user.username}`} className="list-group-item list-group-item-action">
              <h4>
                <strong>@{user.username} </strong>{" "}
              </h4>
              <span className="text-muted">
                {user.firstName} {user.lastName}
              </span>
            </Link>
          );
        })}
      </div>
    </Page>
  );
}

export default AllUsers;
