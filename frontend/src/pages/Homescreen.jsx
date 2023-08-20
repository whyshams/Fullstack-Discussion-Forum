import { useContext, useEffect } from "react";
import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import Posts from "../components/Posts";
import CreatePost from "../components/CreatePost";
import { useGetAllPostMutation } from "../slices/postSlice";
import Loading from "../components/Loading";
import MainContext from "../context/MainContext";

const Homescreen = () => {
  const { userData } = useSelector((state) => state.auth);
  console.log(userData);
  const { loading } = useContext(MainContext);

  return (
    <div className="mt-5">
      <div className="">
        {userData ? (
          <div>
            <Posts />
          </div>
        ) : (
          <div className="d-center">
            <Card className="cardupdate p-4 m-4 rounded-full screen">
              <h4 className="d-flex text-center ">
                A hypothetical Teacher Student Forum where teacher can post and
                students can only like and comment
              </h4>
              <div className="d-flex justify-content-around homebutton">
                <div className="home-button">
                  <Link to="/login">Login</Link>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Homescreen;
