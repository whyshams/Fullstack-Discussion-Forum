import React, { useState, useContext, useEffect } from "react";
import { Card, Image } from "react-bootstrap";
import axios from "axios";
import Comments from "../components/Comments";
import { useSelector } from "react-redux";
import MainContext from "../context/MainContext";
import { BsHandThumbsUp, BsHandThumbsUpFill } from "react-icons/bs";
import { BiComment } from "react-icons/bi";
import { useSinglePostMutation } from "../slices/postSlice";
import { Link } from "react-router-dom";
import Loading from "../components/Loading";

const SinglePost = () => {
  const {
    singlePostData,
    postsUpdated,
    setPostsUpdated,
    setSinglePostData,
    setLoading,
    loading,
  } = useContext(MainContext);

  const [commentOpen, setCommentOpen] = useState(false);
  const [isLiked, setIsLike] = useState(false);
  const [data, setData] = useState(singlePostData);
  const numberOfLikes = Object.keys(data.likes).length;
  console.log(singlePostData);
  const { userData } = useSelector((state) => state.auth);

  const [singlePost] = useSinglePostMutation();

  const postLikeHandle = async () => {
    try {
      await axios.patch(`/api/v2/posts/${data._id}/like`, {
        userId: userData._id,
      });

      setPostsUpdated(!postsUpdated);
    } catch (error) {
      console.error("Error creating comment:", error);
    }
  };
  const orderedComments = data.comments
    ?.slice()
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  const getSinglePost = async () => {
    try {
      const res = await singlePost(singlePostData._id);
      console.log(res);
      setData(res.data);

      setPostsUpdated(!postsUpdated);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getSinglePost();
  }, [postsUpdated]);
  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <Card className="">
          <div className="d-flex flex-column p-3">
            <div className="d-flex flex-row">
              <div className="p-2">
                <img className="postImage" src={`${data.userProfileImage}`} />
              </div>
              <Link to={`/user/${data.userId}`}>
                <strong className="m-3">{data.name}</strong>
              </Link>
            </div>
            <p>{data.description}</p>
            <div className="d-center">
              {data.image && (
                <img className="singlepostimage " src={`${data.image}`} />
              )}
            </div>
          </div>
          <div className="d-flex justify-content-around align-items-center p-5">
            <button className="likeButton" onClick={postLikeHandle}>
              {data.likes[userData._id] === true || isLiked ? (
                <div>
                  <BsHandThumbsUpFill /> {numberOfLikes}
                </div>
              ) : (
                <div onClick={() => setIsLike(!isLiked)}>
                  <BsHandThumbsUp /> {numberOfLikes}
                </div>
              )}
            </button>

            <button
              className="likeButton"
              onClick={() => setCommentOpen(!commentOpen)}
            >
              <BiComment /> {data.comments.length}
            </button>
          </div>

          <div className="comment ">
            <Comments post={data} />
            {orderedComments.map((data) => (
              <div key={data._id} className="d-flex p-3">
                <img className="ppImage " src={`${data.userProfileImage}`} />
                <Link to={`/user/${data.userId}`}>
                  <h6 className="m-2">{data.username}:</h6>
                </Link>
                <strong className="m-2">"{data.text}"</strong>
              </div>
            ))}
          </div>
        </Card>
      )}
    </>
  );
};

export default SinglePost;
