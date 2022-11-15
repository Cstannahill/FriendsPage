import React, { useCallback, useEffect, useState } from "react";
import toastr from "toastr";
import friendsService from "../../services/friendsService";
import SelectPagedItem from "../selectPage/SelectPagesForm";
import "./friends.css";
import FriendsMap from "./FriendCards";
import { Link, useNavigate } from "react-router-dom";
import swal from "@sweetalert/with-react";

function Friends() {
  const [friends, setFriendData] = useState({
    arrayOfFriends: [],
    friendComponents: [],
  });
  const [show, setShow] = useState({ isShown: true });
  const [pgValue, setPageValue] = useState({
    count: 9,
    pageSize: 6,
    pageIndex: 0,
    current: 1,
  });

  const [searchValue, setSearchValue] = useState({
    query: "",
  });

  const navigate = useNavigate();

  const onDeleteRequested = useCallback((friendId) => {
    //calling function via props on the FriendCards element (ex. props.onDeleteRequested(friend)) to retrieve the id for the specific card that was clicked on
    console.log("Fr. Main Component: ->", friendId);
    const deleteHandler = getDeleteSuccessHandler(friendId);
    swal({
      title: "Woah there, buddy!",
      text: "Are you sure you want to delete your friend?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        friendsService
          .deleteFriend(friendId)
          .then(deleteHandler)
          .catch(onDeleteFriendError);
      } else {
        swal("Relax, you still have your two friends or whatever.");
      }
    });
  }, []);

  const getDeleteSuccessHandler = (id) => {
    //on successful delete call to API using the Id passed in from on delete request function to match with the id of the array in state of friends to splice out that specific friend object and then map the JSX array off the updated array to update the DOM
    console.log("DeleteSuccessHandler", id);
    return () => {
      console.log("Delete Friend Success", id);
      setFriendData((prevState) => {
        const friendData = { ...prevState };
        friendData.arrayOfFriends = [...friendData.arrayOfFriends];
        const idxOf = friendData.arrayOfFriends.findIndex((friend) => {
          let result = false;
          if (friend.id === id) {
            console.log(friend.id, id);
            result = true;
          }
          return result;
        });
        if (idxOf >= 0) {
          friendData.arrayOfFriends.splice(idxOf, 1);
          friendData.friendComponents =
            friendData.arrayOfFriends.map(mapFriends);
          swal("Friend has been successfully deleted.", {
            icon: "success",
          });
        }
        return friendData; // do this
      });
    };
  };

  const onDeleteFriendError = (error) => {
    console.warn("Delete Friend error", error);
    navigate();
  };

  const mapFriends = (friends) => {
    console.log("mapping", friends);
    return (
      <FriendsMap
        friend={friends}
        key={friends.id}
        onPersonClicked={onDeleteRequested}
        onEditClicked={onEditRequested}
      />
    );
  };

  const onPageChange = (page) => {
    setPageValue((prevState) => {
      const newPage = { ...prevState };
      newPage.current = page;
      newPage.pageIndex = newPage.current - 1;
      return newPage;
    });
  };

  const onSelectPageSize = (event) => {
    const target = event.target;
    const newVal = target.value;
    setPageValue((prevState) => {
      const newValue = { ...prevState };
      console.log(newValue);
      newValue.pageSize = Number(newVal);

      return newValue;
    });
  };

  const onSearchFieldChange = (event) => {
    //updater function for state for search input field/state
    console.log("onChange", { syntheticEvent: event });
    const target = event.target;
    const newSearchValue = target.value;
    const nameOfField = target.name;
    setSearchValue((prevState) => {
      const newSearchData = {
        ...prevState,
      };
      newSearchData[nameOfField] = newSearchValue;
      console.log(newSearchData);
      return newSearchData;
    });
  };

  useEffect(() => {
    //making getFriends call initially when the page loads, and when the current page or page size changes
    friendsService
      .getFriends(pgValue.pageIndex, pgValue.pageSize)
      .then(onGetFriendsSuccess)
      .catch(onGetFriendsError);
  }, [pgValue.current, pgValue.pageSize]);

  const onGetFriendsSuccess = (response) => {
    //on successful call to getFriends taking the response, setting the total count of friends, and setting arrayOfFriends as the array of friend objects that is returned, and friendComponents to a mapped array of JSX elements
    console.log("Friends Get Page success :", response);
    let newArrayOfFriends = response.pagedItems;
    setFriendData((prevState) => {
      const friendsData = { ...prevState };
      friendsData.arrayOfFriends = newArrayOfFriends;
      friendsData.friendComponents = newArrayOfFriends.map(mapFriends);
      return friendsData;
    });
    setPageValue((prevState) => {
      //
      const newPageData = { ...prevState };
      newPageData.count = response.totalCount;
      return newPageData;
    });
  };

  const onGetFriendsError = (error) => {
    console.warn("Error Getting Friends Page: ", error);
  };

  const onShowClicked = () => {
    setShow((prevState) => {
      let toggle = { ...prevState };
      toggle.isShown = !prevState.isShown;
      return toggle;
    });
  };

  const renderFriends = () => {
    return (
      <div className="row flex-wrap d-flex card-deck justify-content-center friendContainer">
        {friends.friendComponents}
      </div>
    );
  };

  const onSearchSubmitted = (e) => {
    // making call to getFriendBySearch IF there is anything in query state which is updated when search input is typed in. If not will make call to getFriends to "reset" page to a normal get call with no query
    e.preventDefault();
    if (searchValue.query) {
      friendsService
        .getFriendBySearch(
          pgValue.pageIndex,
          pgValue.pageSize,
          searchValue.query
        )
        .then(onGetFriendsBySearchSuccess)
        .catch(onGetFriendsBySearchError);
    } else {
      friendsService
        .getFriends(pgValue.pageIndex, pgValue.pageSize)
        .then(onGetFriendsSuccess)
        .catch(onGetFriendsError);
    }
  };

  const onGetFriendsBySearchSuccess = (response) => {
    //setting array of friend objects from the response of getFriendsBySearch in state as well as the friendComponents array to an array of JSX elements after mapping
    console.log("Search Success", response);
    toastr.success("Search Successful");
    let newArrayOfFriends = response;
    setFriendData((prevState) => {
      const friendsData = { ...prevState };
      friendsData.arrayOfFriends = newArrayOfFriends;
      friendsData.friendComponents = newArrayOfFriends.map(mapFriends);
      return friendsData;
    });
  };

  const onGetFriendsBySearchError = (error) => {
    console.warn("SearchFriends error: ", error);
    toastr.error("There was an error during the search.");
  };

  const onEditRequested = useCallback((friend) => {
    //passing this function via props to FriendCard component and calling it from there (ex props.onEditRequested(friend)) to retrieve the information from the single friend prop of that card originally passed to the component during mapping
    console.log(friend.primaryImage, "request");
    const friendState = {
      title: friend.title,
      bio: friend.bio,
      primaryImage: friend.primaryImage,
      headline: friend.headline,
      id: friend.id,
      slug: friend.slug,
      statusId: friend.statusId,
      summary: friend.summary,
    };
    if (friend.skills) {
      friendState.skills = friend.skills.map((skill) => skill.name);
    }
    const stateForTransport = { type: "edit_Friend", payload: friendState };
    navigate(`/friends/${friendState.id}`, { state: stateForTransport });
  }, []);

  return (
    <>
      <main role="main" className="friends">
        <div className="container friends">
          <div className="formDiv d-flex align-items-center">
            <h5 className="ml-2">Search Friends:</h5>
            <form className="form-inline friendsSearchForm my-2">
              <input
                className="form-control form-inline mr-sm-2 friendsSearch"
                type="search"
                placeholder="Search"
                aria-label="Search"
                name="query"
                onChange={onSearchFieldChange}
              />
              <button
                className="btn btn-md btn-secondary mx-2 align-top"
                type="submit"
                onClick={onSearchSubmitted}
              >
                Search
              </button>
            </form>
            <button
              className="btn btn-dark rowButton mx-2"
              onClick={onShowClicked}
            >
              {show.isShown ? "Hide Friends" : "Show Friends"}
            </button>
            <Link
              className="btn btn-success float-right rowButton buttonRight mx-2"
              to={"/friends/new"}
            >
              + Add Friend
            </Link>
          </div>
          <div className="p-2 mb-4 rounded-3">
            <div className="container text-center d-inline-block">
              <h1 className="display-5 fw-bold friends text-center text-dark d-inline-block">
                Friends
              </h1>
              <SelectPagedItem
                pgInfo={pgValue}
                changePageSize={onSelectPageSize}
                onPageChange={onPageChange}
              />
            </div>
          </div>
          {show.isShown && renderFriends()}
          <hr />
        </div>
      </main>
    </>
  );
}

export default Friends;
