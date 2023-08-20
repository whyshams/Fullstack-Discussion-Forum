import React, { useState, useContext } from "react";
import { Card } from "react-bootstrap";
import axios from "axios";
import Comments from "./Comments";
import { useSelector } from "react-redux";
import MainContext from "../context/MainContext";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import UpdatePost from "./UpdatePost";
import { useDeletePostMutation } from "../slices/postSlice";
import { toast } from "react-toastify";
import { BsHandThumbsUp, BsHandThumbsUpFill } from "react-icons/bs";
import { BiComment } from "react-icons/bi";
import moment from "moment";
import Loading from "./Loading";

const Post = ({ post }) => {
  const [commentOpen, setCommentOpen] = useState(false);
  const [editClicked, setEditClicked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const [deletePost] = useDeletePostMutation();

  const numberOfLikes = Object.keys(post.likes).length;
  console.log(post);
  const { userData } = useSelector((state) => state.auth);
  const { postsUpdated, setPostsUpdated, loading, setLoading } =
    useContext(MainContext);

  const postLikeHandle = async () => {
    try {
      await axios.patch(`/api/v2/posts/${post._id}/like`, {
        userId: userData._id,
      });
      setPostsUpdated(!postsUpdated);
    } catch (error) {
      console.error("Error creating comment:", error);
    }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      await deletePost({ _id: post._id });
      setPostsUpdated(!postsUpdated);
      setLoading(false);
      toast.success("Post Deleted!", {
        position: toast.POSITION.TOP_CENTER,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const orderedComments = post.comments
    ?.slice()
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return (
    <>
      <Card className="my-3">
        <div className=" postEditButton ">
          <div onClick={() => setEditClicked(!editClicked)} className="">
            <FaEdit />
          </div>
          <div onClick={handleDelete} className="deleteIcon">
            <MdDelete />
          </div>
        </div>
        {editClicked ? (
          <UpdatePost Post={post} setEditClicked={setEditClicked} />
        ) : (
          <div className="porfilebody">
            <div className="d-flex flex-column p-3">
              <div className="d-flex flex-row">
                <div className="p-2">
                  <img className="postImage" src={`${post.userProfileImage}`} />
                </div>
                <p className="p-3">{post.name}</p>
              </div>
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
            <div className="d-flex justify-content-around align-items-center p-4">
              <button className="likeButton" onClick={postLikeHandle}>
                {post.likes[userData._id] === true || isLiked ? (
                  <div>
                    <BsHandThumbsUpFill /> {numberOfLikes}
                  </div>
                ) : (
                  <div onClick={() => setIsLiked(true)}>
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
                  <div className="d-flex p-3">
                    <img className="ppImage" src={`${data.userProfileImage}`} />

                    <h6>{data.username}:</h6>
                    <strong>"{data.text}"</strong>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </Card>
    </>
  );
};

export default Post;
