import React, { useState, useEffect } from "react";
import friendsService from "../../services/friendsService";
import toastr from "toastr";
import { useLocation } from "react-router-dom";
import { Formik, Form, Field, FieldArray } from "formik";
import FormLogger from "../Formik/FormLogger";
import { addFile } from "../../services/fileService";

function FriendsData() {
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

  console.log(file);
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

  return (
    <React.Fragment>
      <main role="main">
        <div className="container">
          <h1 className="display-5 fw-bold text-center my-3">
            Friend Information
          </h1>
          <Formik
            enableReinitialize={true}
            initialValues={friendFormData}
            onSubmit={onSubmitFriendData}
          >
            {({ values }) => (
              <Form>
                <FormLogger />
                <div className="d-flex wrapper justify-content-center my-6">
                  <div className="form-group col-6 my-3 px-4 py-3 friendForm card friendCard">
                    <label className="fw-bold" htmlFor="inputTitle">
                      Name
                    </label>
                    <Field
                      type="text"
                      className="form-control friendInput my-3"
                      name="title"
                      id="inputTitle"
                      placeholder="Jane Adams"
                    />
                    <label className="fw-bold" htmlFor="inputBio">
                      Bio
                    </label>
                    <Field
                      type="text"
                      className="form-control friendInput my-3"
                      name="bio"
                      id="inputBio"
                      placeholder="Jane writes novels in her free time etc..."
                    />

                    <label className="fw-bold" htmlFor="inputSummary">
                      Summary
                    </label>
                    <Field
                      type="text"
                      className="form-control friendInput my-3"
                      name="summary"
                      id="inputSummary"
                      placeholder="Jane is a writer."
                    />
                    <label className="fw-bold" htmlFor="inputHeadline">
                      Headline
                    </label>
                    <Field
                      type="text"
                      className="form-control friendInput my-3"
                      name="headline"
                      id="inputHeadline"
                      placeholder="Expert Writer"
                    />
                    <label className="fw-bold" htmlFor="inputSlug">
                      Slug
                    </label>
                    <Field
                      type="text"
                      className="form-control friendInput my-3"
                      name="slug"
                      id="inputSlug"
                      placeholder="xyz123992"
                    />
                    <label className="fw-bold" htmlFor="inputStatusId">
                      Status Id
                    </label>
                    <Field
                      component="select"
                      type="text"
                      className="form-control friendInput my-3"
                      name="statusId"
                      id="inputStatusId"
                      placeholder="Active, Flagged, Deleted, Not Set"
                      style={{
                        appearance: "menulist",
                      }}
                    >
                      <option value={0} key={`status${0}`}>
                        {"Not Set"}
                      </option>

                      <option value={1} key={`status${1}`}>
                        {"Active"}
                      </option>

                      <option value={2} key={`status${2}`}>
                        {" "}
                        {"Deleted"}
                      </option>

                      <option value={3} key={`status${3}`}>
                        {" "}
                        {"Flagged"}
                      </option>
                    </Field>
                    <label className="fw-bold" htmlFor="inputUrl">
                      Image Url
                    </label>
                    <Field
                      type="url"
                      className="form-control friendInput my-3"
                      name="primaryImage.url"
                      id="inputUrl"
                      placeholder="https://bit.ly/3vUboU2"
                    />
                    <small id="emailHelp" className="form-text text-dark">
                      If you choose to upload a file, that will be set as your
                      image. You do not need to provide both a URL and file.
                    </small>
                    <input
                      id="file"
                      name="file"
                      type="file"
                      onChange={onFileUploadChange}
                    />
                    <label className="fw-bold" htmlFor="inputSkill">
                      Skills
                    </label>
                    <FieldArray name="skills">
                      {({ push, remove }) => (
                        <div>
                          <button
                            className="btn btn-primary addSkillButton my-1"
                            type="button"
                            onClick={() => push("")}
                          >
                            Add
                          </button>
                          {values?.skills?.length >= 1 &&
                            values.skills.map((skill, index) => (
                              <div
                                className="row my-2"
                                key={index}
                                style={{ width: "100%" }}
                              >
                                <div className="col-10">
                                  <Field
                                    type="text"
                                    name={`skills.${index}`}
                                    className="form-control friendInput jobSkillField"
                                    placeholder="skills"
                                  />
                                </div>
                                <div className="col-1">
                                  <button
                                    className="btn btn-danger"
                                    type="button"
                                    onClick={() => {
                                      remove(index);
                                    }}
                                  >
                                    remove
                                  </button>
                                </div>
                              </div>
                            ))}
                        </div>
                      )}
                    </FieldArray>
                    <button
                      type="submit"
                      className="btn btn-dark friendForm mt-2"
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </main>
    </React.Fragment>
  );
}

export default FriendsData;
