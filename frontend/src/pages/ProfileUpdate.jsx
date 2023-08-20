import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  useUpdateUserMutation,
  useDeleteUserMutation,
} from "../slices/usersApiSlice";

import { setCredential } from "../slices/authSlice";
import { toast } from "react-toastify";
import { Formik } from "formik";
import * as yup from "yup";
import Dropzone from "react-dropzone";

const Update = () => {
  const { userData } = useSelector((state) => state.auth);
  const initialValuesRegister = {
    name: userData.name,
    username: userData.username,
    email: userData.email,
    picture: userData.picturePath,
    password: userData.password,
    role: userData.role,
  };
  const registerSchema = yup.object().shape({
    name: yup.string(),
    username: yup.string(),
    email: yup.string(),
    picture: yup.string(),
    password: yup.string(),
    role: yup.string(),
  });

  const [updateUser] = useUpdateUserMutation();
  const [deleteUser] = useDeleteUserMutation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleFormSubmit = async (values, onSubmitProps) => {
    const formData = new FormData();

    for (let value in values) {
      formData.append(value, values[value]);
    }
    if (values.picture.name) {
      formData.append("picturePath", values.picture.name);
    } else {
      formData.append("picturePath", userData.picturePath);
    }
    formData.append("_id", userData._id);

    try {
      const res = await updateUser(formData).unwrap();
      console.log(res);
      dispatch(setCredential({ ...res }));
      navigate("/");

      toast.success("Profile Updated Succesfully!", {
        position: toast.POSITION.TOP_CENTER,
      });
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteUser({ _id: userData._id });
      dispatch(setCredential(""));
      navigate("/");
      toast.success("We are sorry to let you go :(", {
        position: toast.POSITION.TOP_CENTER,
      });
    } catch (error) {
      toast.error(error?.data?.message);
    }
  };

  return (
    <Formik
      onSubmit={handleFormSubmit}
      initialValues={initialValuesRegister}
      validationSchema={registerSchema}
    >
      {({
        values,
        errors,
        touched,
        handleBlur,
        handleChange,
        handleSubmit,
        setFieldValue,
        resetForm,
      }) => (
        <div>
          <form
            className=" screen login-form text-center"
            onSubmit={handleSubmit}
          >
            <div className="d-flex flex-column justify-content-center align-items-center">
              <input
                placeholder="Name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.name}
                name="name"
              />
              <select
                className="select"
                name="role"
                onChange={handleChange}
                value={values.role}
              >
                <option value="">Select a Role</option>
                <option value="teacher">Teacher</option>
                <option value="student">Student</option>

                {/* Add more options as needed */}
              </select>

              <input
                placeholder="Email"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.email}
                name="email"
              />
              <input
                placeholder="Username"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.username}
                name="username"
              />
              <input
                placeholder="Password"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.password}
                name="password"
              />

              <Dropzone
                acceptedFiles=".jpg,.jpeg,.png"
                multiple={false}
                onDrop={(acceptedFiles) => {
                  setFieldValue("picture", acceptedFiles[0]);
                }}
              >
                {({ getRootProps, getInputProps }) => (
                  <div {...getRootProps()}>
                    <input {...getInputProps()} />
                    {!values.picture ? (
                      <p className="dropzone">Add Picture</p>
                    ) : (
                      <p className="dropzone">Change Profile Photo</p>
                    )}
                  </div>
                )}
              </Dropzone>
              <button className="btn-primary btn" type="submit">
                Update
              </button>
            </div>
          </form>
          <div className="d-center">
            <button className="btn-danger btn" onClick={handleDelete}>
              Deactivate Account
            </button>
          </div>
        </div>
      )}
    </Formik>
  );
};

export default Update;
