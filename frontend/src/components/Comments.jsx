import React, { useState, useContext } from "react";
import axios from "axios";
import MainContext from "../context/MainContext";
import { useSelector } from "react-redux";
import Loading from "./Loading";
import { useCreateCommentMutation } from "../slices/postSlice";

const PostDetail = ({ post }) => {
  const [newComment, setNewComment] = useState("");
  const { postsUpdated, setPostsUpdated } = useContext(MainContext);
  const [commentLoad, setCommentLoad] = useState(false);
  const [createComment] = useCreateCommentMutation();
  const { userData } = useSelector((state) => state.auth);

  const handleCommentCreate = async () => {
    setCommentLoad(true);

    const body = {
      _id: post._id,

      userId: userData._id,
      text: newComment,
    };

    try {
      await createComment(body).unwrap();
      setPostsUpdated(!postsUpdated);
      setCommentLoad(false);
      setNewComment("");
    } catch (error) {
      console.error("Error creating comment:", error);
    }
  };

  return (
    <div className="d-flex flex-column text-center p-2">
      {commentLoad ? (
        <Loading />
      ) : (
        <div>
          <h3>Add a New Comment</h3>
          <textarea
            className="commentArea"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <div className="d-center">
            <button className="commentBtn " onClick={handleCommentCreate}>
              Add Comment
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostDetail;
