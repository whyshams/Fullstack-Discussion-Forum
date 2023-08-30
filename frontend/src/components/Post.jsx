import React, { useState, useContext } from "react";
import { Card } from "react-bootstrap";
import axios from "axios";
import Comments from "./Comments";
import { useSelector } from "react-redux";
import MainContext from "../context/MainContext";
import { BsHandThumbsUp, BsHandThumbsUpFill } from "react-icons/bs";
import { BiComment } from "react-icons/bi";
import { useNavigate, Link } from "react-router-dom";
import {
  useSinglePostMutation,
  useLikePostMutation,
} from "../slices/postSlice";

import moment from "moment";

const Post = ({ post }) => {
  const [commentOpen, setCommentOpen] = useState(false);
  const [likeClicked, setLikeClicked] = useState(false);
  const numberOfLikes = Object.keys(post.likes).length;
  const [likePost] = useLikePostMutation();
  const navigate = useNavigate();
  const [singlePost] = useSinglePostMutation();
  const { userData } = useSelector((state) => state.auth);
  const { postsUpdated, setPostsUpdated, setSinglePostData } =
    useContext(MainContext);

  const postLikeHandle = async () => {
    const body = {
      postId: post._id,
      userId: userData._id,
    };
    try {
      await likePost(body);

      setPostsUpdated(!postsUpdated);
    } catch (error) {
      console.error("Error creating comment:", error);
    }
  };

  const singlePostReq = () => {
    setSinglePostData(post);
    navigate("/singlepost");
  };

  const orderedComments = post.comments
    ?.slice()
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return (
    <>
      <Card className="">
        <div className="d-flex flex-column p-3">
          <div className="d-flex flex-row">
            <Link to={`/user/${post.userId}`}>
              <div className="p-2">
                <img className="postImage" src={`${post.userProfileImage}`} />

                <strong className="p-3">{post.name}</strong>
              </div>
            </Link>
          </div>
          <div onClick={singlePostReq}>
            <p>{post.description}</p>
            <div className="d-center">
              {post.image && (
                <img className="postsImage" src={`${post.image}`} />
              )}
            </div>
            <p className="mt-3 text-muted">
              Posted {moment(post.createdAt).fromNow()}
            </p>
          </div>
        </div>
        <div className="d-flex justify-content-around align-items-center p-4">
          <button className="likeButton" onClick={postLikeHandle}>
            {post.likes[userData._id] === true || likeClicked ? (
              <div onClick={() => setLikeClicked(!likeClicked)}>
                <BsHandThumbsUpFill /> {numberOfLikes}
              </div>
            ) : (
              <div onClick={() => setLikeClicked(!likeClicked)}>
                <BsHandThumbsUp /> {numberOfLikes}
              </div>
            )}
          </button>
          <button
            className="likeButton"
            onClick={() => setCommentOpen(!commentOpen)}
          >
            <BiComment /> {post.comments.length}
          </button>
        </div>
        {commentOpen && (
          <div className="comment ">
            <Comments post={post} />
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
        )}
      </Card>
    </>
  );
};

export default Post;
