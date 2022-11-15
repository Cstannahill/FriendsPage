import React from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { friendValidation } from "../../../services/validation";

function FriendsInfoForm(props) {
  const {
    // Formik HOC props
    // values,
    // touched,
    // errors,
    // isSubmitting,
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
  console.log(props.friend);

  return (
    <>
      <Formik
        initialValues={props.friend}
        enableReinitialize={true}
        onSubmit={onNext}
        validationSchema={friendValidation}
      >
        {({ isValid, dirty, isSubmitting }) => (
          <Form>
            <div className="d-flex wrapper justify-content-center text-dark my-5">
              <div className="form-group col-8 my-5 px-4 py-5 card friendForm friendCard">
                <h3 className="text-center">Basic Information</h3>
                <label className="fw-bold" htmlFor="inputName">
                  Name
                </label>
                <Field
                  type="text"
                  className="form-control techFormInput formInputText my-3"
                  name="title"
                  id="inputName"
                  placeholder="Eventropolis"
                />
                <ErrorMessage
                  className="mb-1 validationText"
                  name="title"
                  component="div"
                />
                <label className="fw-bold" htmlFor="inputHeadline">
                  Bio
                </label>
                <Field
                  type="text"
                  className="form-control techFormInput formInputText my-3"
                  name="bio"
                  id="inputHeadline"
                  placeholder="4-Day event thing."
                />
                <ErrorMessage
                  className="mb-1 validationText"
                  name="bio"
                  component="div"
                />
                <label className="fw-bold" htmlFor="inputDescription">
                  Summary
                </label>
                <Field
                  type="text"
                  className="form-control techFormInput formInputText my-3"
                  name="summary"
                  id="inputDescription"
                  placeholder="Eventropolis is an event that etc."
                />
                <ErrorMessage
                  className="mb-1 validationText"
                  name="summary"
                  component="div"
                />
                <label className="fw-bold" htmlFor="inputSummary">
                  Headline
                </label>
                <Field
                  type="text"
                  className="form-control techFormInput formInputText my-3"
                  name="headline"
                  id="inputSummary"
                  placeholder="4-Day event fair."
                />
                <ErrorMessage
                  className="mb-1 validationText"
                  name="headline"
                  component="div"
                />
                <label className="fw-bold" htmlFor="inputSlug">
                  Slug
                </label>
                <Field
                  type="text"
                  className="form-control techFormInput formInputText my-3"
                  name="slug"
                  id="inputSlug"
                  placeholder="xyz91"
                />
                <ErrorMessage
                  className="mb-1 validationText"
                  name="slug"
                  component="div"
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
                    disabled={!isValid || !dirty || isSubmitting}
                  >
                    {nextLabel}
                  </button>
                </div>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
}

export default FriendsInfoForm;
//   mapPropsToValues: (props) => ({
//     title: props.friend.title,
//     bio: props.friend.bio,
//     summary: props.friend.summary,
//     headline: props.friend.headline,
//     slug: props.friend.slug,
//     statusId: props.friend.statusId,
//     id: props.friend.id,
//   }),

//   validationSchema: Yup.object().shape({
//     title: Yup.string().required(),
//     bio: Yup.string().required(),
//     summary: Yup.string().required(),
//     headline: Yup.string().required(),
//     slug: Yup.string().required(),
//     statusId: Yup.number().integer().required(),
//   }),

//   handleSubmit: (values, { props }) => {
//     props.onNext(values);
//   },
// })(FriendsInfoForm);
