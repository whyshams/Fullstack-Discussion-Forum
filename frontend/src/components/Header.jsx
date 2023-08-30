import { useSelector, useDispatch } from "react-redux";
import { Nav, NavDropdown, Navbar } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useLogoutApiMutation } from "../slices/usersApiSlice";
import { logOut } from "../slices/authSlice";
import { LinkContainer } from "react-router-bootstrap";

import { toast } from "react-toastify";

import { useContext } from "react";
import MainContext from "../context/MainContext";

const Header = () => {
  const { allPostsData } = useContext(MainContext);

  const { userData } = useSelector((state) => state.auth);

  const [logoutApi] = useLogoutApiMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutApi().unwrap();
      dispatch(logOut());
      navigate("/");
      toast.success("Logged Out!", {
        position: toast.POSITION.TOP_CENTER,
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <header className="">
      {userData ? (
        <>
          <Navbar className="d-md-flex d-block justify-content-between ">
            <LinkContainer to="/">
              <Navbar.Brand className="d-center">LoggedIn</Navbar.Brand>
            </LinkContainer>

            <Nav className="d-center">
              <img className="ppImage" src={`${userData.profileImage}`} />

              <NavDropdown title={userData.name} id="username">
                <LinkContainer to="/profile">
                  <NavDropdown.Item>Profile</NavDropdown.Item>
                </LinkContainer>
                <NavDropdown.Item onClick={handleLogout}>
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar>
        </>
      ) : null}
    </header>
  );
};

export default Header;
