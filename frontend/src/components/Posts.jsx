import React, { useEffect, useState, useContext } from "react";
import { useSelector } from "react-redux";
import {
  useGetAllPostMutation,
  useSinglePostMutation,
} from "../slices/postSlice";
import Post from "./Post";
import Loading from "./Loading";
import Search from "./Search";
import CreatePost from "./CreatePost";
import MainContext from "../context/MainContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Posts = () => {
  const { postsUpdated, setSinglePostData, setLoading, loading } =
    useContext(MainContext);
  const navigate = useNavigate();
  const [postData, setPostData] = useState();
  const { userData } = useSelector((state) => state.auth);

  const [getAllPost] = useGetAllPostMutation();
  const [singlePost] = useSinglePostMutation();

  const getPosts = async () => {
    try {
      const res = await getAllPost({
        token: userData?.data?.token || userData.token,
      });
      setPostData(res?.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getPosts();
  }, [postsUpdated]);

  const orderedPosts = postData
    ?.slice()
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return (
    <>
      <div className="">
        {orderedPosts && (
          <div className="d-block d-md-flex justify-content-between">
            <div className="col-md-3 mt-3 ">
              <div className="mr-3">
                <Search Posts={orderedPosts} />
              </div>
            </div>
            <div className="col-md-4 d-md-none d-flex justify-content-center">
              <div>{userData.role === "teacher" ? <CreatePost /> : null}</div>
            </div>

            <div
              className={
                userData.role === "student" ? "col-md-8 mt-3" : "col-md-5 mt-3"
              }
            >
              {orderedPosts?.map((post) => (
                <Post post={post} key={post._id} />
              ))}
            </div>

            <div className="col-md-4 mt-3 d-none d-md-flex">
              <div>{userData.role === "teacher" ? <CreatePost /> : null}</div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Posts;
