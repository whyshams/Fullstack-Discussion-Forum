import React, { useState, useEffect, useContext } from "react";

import axios from "axios";
import { useSelector } from "react-redux";
import MainContext from "../context/MainContext";
import { FaEdit } from "react-icons/fa";
import { Link } from "react-router-dom";
import UserPost from "../components/UserPost";
import Loading from "../components/Loading";

const Profile = () => {
  const [userPostData, setUserPostData] = useState();

  const { userData } = useSelector((state) => state.auth);
  const { postsUpdated, setPostsUpdated, setLoading, loading } =
    useContext(MainContext);

  const getUserPostData = async () => {
    setLoading(true);
    const res = await axios.get(`api/v2/posts/${userData._id}/posts`);
    setUserPostData(res.data);
    setLoading(false);
  };

  useEffect(() => {
    setPostsUpdated(true);
    getUserPostData();
  }, [postsUpdated]);

  console.log(userPostData);
  const orderedPosts = userPostData
    ?.slice()
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return (
    <>
      <div className="d-md-flex d-block mt-5">
        <div
          className={`${
            userPostData?.length > 0
              ? "col-md-5 col-12 text-center"
              : "col-md-12 text-center"
          } `}
        >
          <div className="d-flex flex-column">
            <div className="mt-5">
              {userData.picturePath ? (
                <img
                  className="profilePageImage"
                  src={`/assets/${userData.picturePath}`}
                />
              ) : (
                <img
                  className="profilePageImage"
                  src={`${userData.profileImage}`}
                />
              )}
            </div>
            <div className="d-flex flex-row d-center mt-2">
              <strong>@{userData.username}</strong>
            </div>
            <div className="d-flex flex-row d-center mt-4">
              <strong>{userData.name}</strong>
            </div>
            <div className="d-flex flex-row d-center mt-2">
              <strong>{userData.email}</strong>
            </div>
            <div className="d-flex flex-row d-center mt-4 editIcon">
              <div>
                <Link to="/update-profile">
                  <FaEdit />
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="d-center">{loading && <Loading />}</div>

        {userPostData && (
          <div className="col-md-7 col-12">
            <div className="d-flex flex-column m-4">
              {orderedPosts?.map((post) => (
                <UserPost post={post} key={post._id} />
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Profile;
