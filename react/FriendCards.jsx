import React from "react";

function FriendsMap(props) {
  console.log(props);
  const friend = props.friend;
  const onLocalDltClicked = (e) => {
    e.preventDefault();
    props.onPersonClicked(props.friend.id);
  };

  const onLocalEditClicked = () => {
    props.onEditClicked(props.friend);
  };

  return (
    <div className="card friendCard col-lg-3  m-4 text-center">
      <img
        className="friend friendImage card-img-top"
        src={friend.primaryImage.url}
        alt="alt"
        height={230}
      />
      <div className="d-flex flex-column card-body">
        <h5 className="card-title text-center">{friend.title}</h5>
        <p className="card-text">{friend.bio}</p>
        <small className="text-small">
          {friend.skills
            ? friend.skills.map((skill) => skill.name).join(", ")
            : null}
        </small>
        <button
          className="friendCard btn-sm btn-primary my-2 mx-auto"
          onClick={onLocalEditClicked}
        >
          Edit
        </button>
        <button
          className="friendCard btn-sm btn-danger mx-auto"
          onClick={onLocalDltClicked}
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default React.memo(FriendsMap);
