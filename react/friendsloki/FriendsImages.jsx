import React from "react";
import { Formik, Form, Field } from "formik";
// import * as Yup from "yup";

function FriendsImages(props) {
  const { friend } = props;
  const { onFileChange } = props;

  console.log(props);
  const {
    // Formik HOC props
    // values,
    // touched,
    // errors,
    isSubmitting,
    // handleChange,
    // handleBlur,
    // handleSubmit,

    // Loki props
    backLabel,
    nextLabel,
    onBack,
    onNext,
    cantBack,
    // isInFinalStep,
  } = props;

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={friend}
        onSubmit={onNext}
      >
        <Form>
          <div className="d-flex wrapper justify-content-center py-5 text-dark my-5">
            <div className="form-group col-8 my-3 px-4 py-5 card friendForm friendCard">
              <h3 className="text-center">Primary Image</h3>
              <label className="fw-bold" htmlFor="inputUrl">
                Image Url
              </label>
              <Field
                type="url"
                className="form-control formInputText  my-3"
                name="primaryImage.url"
                id="inputUrl"
                placeholder="https://bit.ly/3vUboU2"
              />
              <small id="emailHelp" className="form-text text-light">
                If you choose to upload a file, that will be set as your image.
                You do not need to provide both a URL and file.
              </small>
              <input
                id="file"
                name="file"
                type="file"
                className="fileInput"
                onChange={onFileChange}
              />
              <div className="button-group text-center">
                <button
                  type="button"
                  className="btn btn-lg btn-secondary mx-2"
                  onClick={onBack}
                  disabled={isSubmitting || cantBack}
                >
                  {backLabel}
                </button>
                <button
                  type="submit"
                  className="btn btn-lg btn-primary mx-2"
                  disabled={isSubmitting}
                >
                  {nextLabel}
                </button>
              </div>
            </div>
          </div>
        </Form>
      </Formik>
    </>
  );
}

export default FriendsImages;
