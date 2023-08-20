import { useEffect, useState, useContext } from "react";
import Dropzone from "react-dropzone";
import { useSelector } from "react-redux";
import { useCreatePostMutation } from "../slices/postSlice";
import { Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import MainContext from "../context/MainContext";

const CreatePost = () => {
  const { postsUpdated, setPostsUpdated, setLoading } = useContext(MainContext);

  const [createPost] = useCreatePostMutation();
  const [post, setPost] = useState();
  const [base64Data, setBase64Data] = useState();
  const [user, setUser] = useState();
  const [token, setToken] = useState();

  const { userData } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    setUser(userData._id);
    setToken(userData.token);
  }, []);

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

  const handleSubmit = async () => {
    const body = {
      token: token,
      userId: user,
      description: post,
      image: base64Data,
    };

    try {
      setLoading(true);
      await createPost(body).unwrap();
      setPostsUpdated(!postsUpdated);

      setPost("");
      setBase64Data("");
      setLoading(false);

      toast.success("Post Uploaded!", {
        position: toast.POSITION.TOP_CENTER,
      });
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <div className="">
      <Card className="p-4 createPost">
        <h1>Create a post </h1>
        <Card className="p-3 ">
          <div className="">
            <textarea
              placeholder="what's on your mind"
              className="postInput"
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
                  <p>Add Image Here</p>
                </div>
              </div>
            )}
          </Dropzone>
          {base64Data && <img src={base64Data} className="postImage" />}

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

export default CreatePost;
