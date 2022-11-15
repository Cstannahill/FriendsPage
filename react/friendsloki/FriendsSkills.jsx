import React from "react";
import { Formik, Form, FieldArray, Field, ErrorMessage } from "formik";
import { friendValidationTwo } from "../../../services/validation";

const FriendsSkills = (props) => {
  const { friend } = props;

  const {
    // Loki props
    backLabel,
    nextLabel,
    onBack,
    onNext,
    cantBack,
    // isInFinalStep,
  } = props;

  return (
    <Formik
      initialValues={friend}
      enableReinitialize={true}
      onSubmit={onNext}
      validationSchema={friendValidationTwo}
    >
      {({ values, isValid, dirty, isSubmitting }) => (
        <Form className="p-1">
          <div className="d-flex wrapper justify-content-center text-dark my-5">
            <div className="form-group col-8 my-5 px-4 py-5 card friendForm friendCard">
              <h3 className="text-center">Skills, Profile Status</h3>
              <label className="fw-bold" htmlFor="inputStatusId">
                Status
              </label>
              <Field
                component="select"
                type="text"
                className="form-control techFormInput formInputText my-3"
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
              <ErrorMessage
                className="mb-1 validationText"
                name="statusId"
                component="div"
              />
              <label className="fw-bold mt-3" htmlFor="inputStatusId">
                <p>Skills: </p>{" "}
              </label>
              <strong className="text-capitalize">
                {values?.skills.length >= 1 &&
                  values.skills[0] &&
                  values.skills.join(", ")}
                {values?.skills.length <= 1 && !values.skills[0] && (
                  <strong>--------</strong>
                )}
              </strong>

              <FieldArray name="skills">
                {({ push, remove }) => (
                  <div>
                    <button
                      className="btn btn-primary addSkillButton formInputText border border-solid px-5 my-1"
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
                              name={`skills.${index}`}
                              className="form-control  formInputText jobSkillField"
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
                  disabled={isSubmitting || !isValid || !dirty}
                >
                  {nextLabel}
                </button>
              </div>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default FriendsSkills;
