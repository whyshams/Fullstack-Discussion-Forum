import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import MainContext from "../context/MainContext";
import { useUserPostsMutation } from "../slices/postSlice";
import { useGetUserMutation } from "../slices/usersApiSlice";
import Post from "../components/Post";
import Loading from "../components/Loading";

const UserProfile = () => {
  const { userId } = useParams();
  const { postsUpdated, setPostsUpdated, loading, setLoading } =
    useContext(MainContext);
  const [userPosts] = useUserPostsMutation();
  const [userData, setUserData] = useState();
  const [postData, setPostData] = useState();
  const [getUser] = useGetUserMutation();

  const getUserInfo = async () => {
    const res = await getUser(userId);
    console.log(userId);

    setUserData(res?.data);

    console.log(userData);
  };
  const getUserPosts = async () => {
    setLoading(true);
    const res = await userPosts(userId);
    console.log(res.data);
    setPostData(res?.data);
    setLoading(false);
  };

  useEffect(() => {
    getUserInfo();
    getUserPosts();
  }, [postsUpdated, userId]);

  const orderedPosts = postData
    ?.slice()
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return (
    <>
      <div className="d-md-flex d-block mt-5">
        <div
          className={`${
            postData?.length > 0
              ? "col-md-5 col-12 text-center"
              : "col-md-12 text-center"
          } `}
        >
          <div className="d-flex flex-column">
            <div className="mt-5">
              <img
                className="profilePageImage"
                src={`${userData?.profileImage}`}
              />
            </div>
            <div className="d-flex flex-row d-center mt-2">
              <strong>@{userData?.username}</strong>
            </div>
            <div className="d-flex flex-row d-center mt-4">
              <strong>{userData?.name}</strong>
            </div>
            <div className="d-flex flex-row d-center mt-2">
              <strong>{userData?.email}</strong>
            </div>
            <div className="d-flex flex-row d-center mt-4 editIcon"></div>
          </div>
        </div>
        {postData && (
          <div className="col-md-7 col-12">
            <div className="d-flex flex-column m-4">
              {orderedPosts?.map((post) => (
                <Post post={post} key={post._id} />
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default UserProfile;
