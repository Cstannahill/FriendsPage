import Loki from "react-loki";
import "./loki.css";
import FriendsInfo from "./LokiFriends/FriendsInfo";
import FriendsSkills from "./LokiFriends/FriendsSkills";
import FriendsImages from "./LokiFriends/FriendsImages";
import React, { useState, useEffect } from "react";
import { faUser, faCode, faImage } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import friendsService from "../../services/friendsService";
import toastr from "toastr";
import { useLocation } from "react-router-dom";
import { addFile } from "../../services/fileService";

function LokiFriends() {
  const [friendFormData, setFriendFormData] = useState({
    title: "",
    bio: "",
    summary: "",
    headline: "",
    slug: "",
    statusId: "",
    primaryImage: {
      url: "",
      typeId: 1,
      id: 0,
    },
    skills: [],

    id: "",
  });

  const [file, setFile] = useState();

  const location = useLocation();
  const { state } = location;

  useEffect(() => {
    if (state?.type === "edit_Friend" && state?.payload) {
      setFriendFormData((prevState) => {
        let newData = { ...prevState };
        newData = state.payload;
        newData.primaryImage = {
          url: state.payload.primaryImage.url,
          typeId: 1,
          id: state.payload.primaryImage.id,
        };
        newData.skills = state.payload.skills;
        return newData;
      });
    }
  }, []);
  const onSubmitFriendData = (values) => {
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      const onAddFileSuccess = (response) => {
        console.log("Successful upload: ", response);
        const imgAr = response[0];
        values.primaryImage.url = imgAr;
        setFriendFormData((prevState) => {
          const newData = { ...prevState };
          newData.primaryImage.url = imgAr;
          return newData;
        });
        if (friendFormData.id !== "") {
          friendsService
            .updateFriend(values.id, values)
            .then(onUpdateFriendSuccess)
            .catch(onUpdateFriendError);
        } else {
          friendsService
            .addFriend(values)
            .then(onAddFriendSuccess)
            .catch(onAddFriendError);
        }
      };
      addFile(formData).then(onAddFileSuccess).catch(onAddFileError);
    } else if (friendFormData.id !== "") {
      friendsService
        .updateFriend(values.id, values)
        .then(onUpdateFriendSuccess)
        .catch(onUpdateFriendError);
    } else {
      friendsService
        .addFriend(values)
        .then(onAddFriendSuccess)
        .catch(onAddFriendError);
    }
  };

  const onFileUploadChange = (e) => {
    const targetFiles = e.target.files[0];
    setFile((prevState) => {
      let newFile = { ...prevState };
      newFile = targetFiles;
      return newFile;
    });
  };

  const onAddFriendSuccess = (response) => {
    console.log("Add success", response);
    toastr.success("Friend has been successfully added.");
    setFriendFormData((prevState) => {
      const newFriendData = {
        ...prevState,
      };
      newFriendData.id = response.id;
      console.log(newFriendData);
      return newFriendData;
    });
  };

  const onAddFriendError = (error) => {
    console.warn("Add Error", error);
    toastr.error("There was an error adding your friend.");
  };

  const onAddFileError = (err) => {
    console.warn(`Error adding file: ${err}`);
  };

  const onUpdateFriendSuccess = (response) => {
    console.log("Update Success:", response);
    toastr.success("Friend has been successfully updated.");
    setFriendFormData((prevState) => {
      console.log("updater onChange");
      let newFriendData = {
        ...prevState,
      };
      newFriendData = response;
      console.log(newFriendData);
      return newFriendData;
    });
  };

  const onUpdateFriendError = (error) => {
    console.warn("Update Error", error);
    toastr.error("There was an error updating your friend.");
  };

  const _mergeValues = (values) => {
    setFriendFormData((prevState) => {
      const newState = { ...prevState, ...values };
      return newState;
    });
  };

  const _finishWizard = (values) => {
    setFriendFormData((prevState) => {
      const newState = { ...prevState, ...values };
      onSubmitFriendData(values);
      return newState;
    });
  };
  const complexSteps = [
    {
      label: "Step 1",
      icon: <FontAwesomeIcon icon={faUser} className="mt-3 lokiCenter" />,
      component: <FriendsInfo friend={friendFormData} />,
    },
    {
      label: "Step 2",
      icon: <FontAwesomeIcon icon={faCode} className="mt-3 lokiCenter" />,
      component: (
        <FriendsSkills friend={friendFormData} onFieldChange={_mergeValues} />
      ),
    },
    {
      label: "Step 3",
      icon: <FontAwesomeIcon icon={faImage} className="mt-3 lokiCenter" />,
      component: (
        <FriendsImages
          friend={friendFormData}
          onFileChange={onFileUploadChange}
          onSubmit={onSubmitFriendData}
        />
      ),
    },
  ];

  return (
    <>
      <div className="container col-6">
        <Loki
          steps={complexSteps}
          onNext={_mergeValues.bind()}
          onBack={_mergeValues.bind()}
          onFinish={_finishWizard.bind()}
          noActions
        />
      </div>
    </>
  );
}

export default LokiFriends;
