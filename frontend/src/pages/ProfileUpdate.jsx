import { useState, useEffect, useContext } from "react";
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
import MainContext from "../context/MainContext";
import Loading from "../components/Loading";

const Update = () => {
  const { userData } = useSelector((state) => state.auth);
  const { setLoading, loading } = useContext(MainContext);
  const [base64Data, setBase64Data] = useState();
  const [updatedImage, setUpdatedImage] = useState();
  const [updatedPass, setUpdatedPass] = useState();
  const initialValuesRegister = {
    name: userData.name,
    username: userData.username,
    email: userData.email,
    profileImage: userData.profileImage,
    password: "",
    role: userData.role,
  };
  const registerSchema = yup.object().shape({
    name: yup.string(),
    username: yup.string(),
    email: yup.string(),
    profileImage: yup.string(),
    password: yup.string(),
    role: yup.string(),
  });

  const [updateUser] = useUpdateUserMutation();
  const [deleteUser] = useDeleteUserMutation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (base64Data) {
      setUpdatedImage(base64Data);
    } else {
      setUpdatedImage(userData.profileImage);
    }
  }, [base64Data]);

  const handleFormSubmit = async (values, onSubmitProps) => {
    const body = {
      _id: userData._id,
      token: userData.token,
      name: values.name,
      username: values.username,
      email: values.email,
      profileImage: updatedImage,
      password: values.password,
      role: values.role,
    };

    try {
      setLoading(true);
      const res = await updateUser(body).unwrap();
      console.log(res);
      dispatch(setCredential({ ...res }));
      setLoading(false);
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

  const handleDrop = (acceptedFiles) => {
    const imageFile = acceptedFiles[0];
    if (imageFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setBase64Data(e.target.result);
      };
      reader.readAsDataURL(imageFile);
    }
  };

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
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
                    onDrop={handleDrop}
                  >
                    {({ getRootProps, getInputProps }) => (
                      <div {...getRootProps()}>
                        <input {...getInputProps()} />

                        {userData.profileImage ? (
                          <p className="dropzone">Change Profile Photo</p>
                        ) : (
                          <p className="dropzone">Add Picture</p>
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
      )}
    </>
  );
};

export default Update;
