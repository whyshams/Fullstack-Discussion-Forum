import { useState, useEffect } from "react";
import { Formik } from "formik";
import * as yup from "yup";
import Dropzone from "react-dropzone";
import { useRegistererMutation } from "../slices/usersApiSlice";
import { setCredential } from "../slices/authSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Card } from "react-bootstrap";
import { useLoginMutation } from "../slices/usersApiSlice";

const registerSchema = yup.object().shape({
  name: yup.string().required("required"),
  username: yup.string().required("required"),
  email: yup.string().email("invalid email").required("required"),
  profileImage: yup.string(),
  password: yup.string().required("required"),
  role: yup.string().required("required"),
});

const loginSchema = yup.object().shape({
  username: yup.string().required("required"),
  password: yup.string().required("required"),
});

const initialValuesRegister = {
  name: "",
  username: "",
  email: "",
  picture: "",
  password: "",
  role: "",
};
const initialValuesLogin = {
  username: "",
  password: "",
};

const FormikForm = () => {
  const [pageType, setPageType] = useState("register");
  const [base64Data, setBase64Data] = useState();
  const isLogin = pageType === "login";
  const isRegister = pageType === "register";
  const [registerer] = useRegistererMutation();
  const [login] = useLoginMutation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userData) {
      navigate("/");
    }
  }, [userData]);

  const logIn = async (values, onSubmitProps) => {
    try {
      const res = await login(values).unwrap();
      dispatch(setCredential({ ...res }));
      toast.success("Log in successful!", {
        position: toast.POSITION.TOP_CENTER,
      });
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const register = async (values, onSubmitProps) => {
    // this allows us to send form info with image
    const formData = new FormData();
    for (let value in values) {
      formData.append(value, values[value]);
    }
    formData.append("profileImage", base64Data);

    try {
      const res = await registerer(formData).unwrap();
      dispatch(setCredential({ ...res }));
      navigate("/");
      toast.success("You did great!Account Created Succesfully!", {
        position: toast.POSITION.TOP_CENTER,
      });
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
    onSubmitProps.resetForm();
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

  const handleFormSubmit = async (values, onSubmitProps) => {
    if (isLogin) await logIn(values, onSubmitProps);
    if (isRegister) await register(values, onSubmitProps);
  };

  return (
    <Formik
      onSubmit={handleFormSubmit}
      initialValues={isLogin ? initialValuesLogin : initialValuesRegister}
      validationSchema={isLogin ? loginSchema : registerSchema}
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
        <div className="screen">
          <form className="login-form text-center" onSubmit={handleSubmit}>
            {isRegister && (
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
                  <option value="">Login as</option>
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

                <Dropzone
                  acceptedFiles=".jpg,.jpeg,.png"
                  multiple={false}
                  onDrop={handleDrop}
                >
                  {({ getRootProps, getInputProps }) => (
                    <div {...getRootProps()}>
                      <input {...getInputProps()} />
                      {!values.picture ? (
                        <p className="dropzone">Add Picture</p>
                      ) : (
                        <p className="dropzone">{values.picture.name}</p>
                      )}
                    </div>
                  )}
                </Dropzone>
                {base64Data && <img src={base64Data} className="postImage" />}
              </div>
            )}
            <div className="d-flex flex-column justify-content-center align-items-center">
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
            </div>
            <button className="btn btn-dark" type="submit">
              {isLogin ? "LOGIN" : "REGISTER"}
            </button>
            <p
              className="signuplink"
              onClick={() => {
                setPageType(isLogin ? "register" : "login");
              }}
            >
              {isLogin
                ? "Dont have an account? Sign Up!"
                : "Login, if you already have an account"}
            </p>
          </form>
        </div>
      )}
    </Formik>
  );
};

export default FormikForm;
