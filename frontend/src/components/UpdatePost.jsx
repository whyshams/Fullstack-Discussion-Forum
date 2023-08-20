import React, { useState, useContext } from "react";
import { Card } from "react-bootstrap";
import Dropzone from "react-dropzone";
import { useUpdatePostMutation } from "../slices/postSlice";
import MainContext from "../context/MainContext";
import { toast } from "react-toastify";

const UpdatePost = ({ Post, setEditClicked }) => {
  const [post, setPost] = useState(Post.description);

  const [base64Data, setBase64Data] = useState();
  const [updatePost] = useUpdatePostMutation();
  const { postsUpdated, setPostsUpdated, setLoading } = useContext(MainContext);

  const handleSubmit = async () => {
    const body = {
      postId: Post._id,
      description: post,
      image: base64Data,
    };
    try {
      setLoading(true);
      await updatePost(body).unwrap();
      setLoading(false);
      setPostsUpdated(!postsUpdated);
      setEditClicked(false);
      toast.success("Post Updated!", {
        position: toast.POSITION.TOP_CENTER,
      });
    } catch (err) {
      toast.error(err?.data?.message || err.error);
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
      console.log(base64Data);
    }
  };

  return (
    <div className="updatePost">
      <Card className="p-4 d-center">
        <h1>Update post </h1>
        <Card className="p-4 ">
          <div className="">
            <textarea
              className=""
              onChange={(e) => setPost(e.target.value)}
              value={post}
            />
          </div>

          <Dropzone
            acceptedFiles=".jpg,.jpeg,.png"
            multiple={false}
            onDrop={handleDrop}
          >
            {({ getRootProps, getInputProps }) => (
              <div>
                <div {...getRootProps()}>
                  <input {...getInputProps()} />
                  {Post.image ? <p>Replace Image</p> : <p>Add Image</p>}
                </div>
              </div>
            )}
          </Dropzone>
          <button
            className="postButton"
            disabled={!post}
            onClick={handleSubmit}
          >
            Post
          </button>
        </Card>
      </Card>
    </div>
  );
};

export default UpdatePost;
