import React, { useState, useContext } from "react";
import { Card } from "react-bootstrap";
import { useSinglePostMutation } from "../slices/postSlice";
import MainContext from "../context/MainContext";
import { useNavigate } from "react-router-dom";

const Search = ({ Posts }) => {
  const { setSinglePostData, setLoading } = useContext(MainContext);
  const [singlePost] = useSinglePostMutation();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredPosts, setFilteredPosts] = useState([]);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    const filtered = Posts.filter((post) =>
      post.description.toLowerCase().includes(query.toLowerCase())
    );

    setFilteredPosts(filtered);
  };

  const getSinglePost = async (id) => {
    try {
      setLoading(true);
      const res = await singlePost(id);
      setSinglePostData(res.data);
      navigate("/singlepost");
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="searchDiv">
      <Card className="p-3">
        <h1>Search Post</h1>
        <input
          type="text"
          placeholder="Search"
          value={searchQuery}
          onChange={handleSearch}
        />
        {searchQuery !== "" && (
          <div className="searchRes">
            <Card className="p-3">
              {filteredPosts.map((post) => (
                <div
                  onClick={() => getSinglePost(post._id)}
                  className="p-4"
                  key={post._id}
                >
                  <div>
                    <div className="d-flex">
                      <img
                        className="searchImg m-1"
                        src={`${post.userProfileImage}`}
                      />

                      <strong className="p-2">{post.name}</strong>
                    </div>
                    <p>{post.description}</p>
                  </div>
                </div>
              ))}
            </Card>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Search;
