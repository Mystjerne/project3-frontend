import axios from "axios";
import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "antd";
import { outlineButton } from "./styleComponents";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useUser } from "./Components/Context/UserContext";

const BACKEND_TALENT_URL = import.meta.env.VITE_SOME_BACKEND_TALENT_URL;
const BACKEND_URL = import.meta.env.VITE_SOME_BACKEND_URL;

const CustomButton = styled(Button)`
  ${outlineButton}
`;

export default function UserCategory() {
  const { updateUserRole } = useUser();
  const { isAuthenticated, loginWithRedirect, getAccessTokenSilently, user } =
    useAuth0();
  const nav = useNavigate();

  const EMPLOYER = "employer";
  const TALENT = "talent";

  const {
    setUserFirstName,
    setUserLastName,
    setUserImage,
    setUserEmail,
    setUserRole,
    setUserID,
  } = useUser();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [selectedRole, setSelectedRole] = useState("");

  useEffect(() => {
    if (isAuthenticated && user) {
      setEmail(user.email);
      setFirstName(user.given_name || user.nickname);
      setLastName(user.family_name || user.nickname);
      setPhotoURL(user.picture);
    }
  }, [isAuthenticated, user]);

  const handleSelection = async (role) => {
    if (!isAuthenticated) {
      loginWithRedirect();
      return;
    }

    setSelectedRole(role); // Store selected role
    setUserFirstName(user.given_name || user.nickname);
    setUserLastName(user.given_name || user.nickname);
    setUserImage(user.picture);
    setUserEmail(user.email);
    setUserRole(role);

    const accessToken = await getAccessTokenSilently({
      audience: import.meta.env.VITE_SOME_AUTH0_AUDIENCE,
      scope: "read:current_user",
    });

    axios
      .post(
        `${BACKEND_URL}/${role}`,
        {
          firstName,
          lastName,
          photo: photoURL,
          email,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      .then(async (res) => {
        setFirstName("");
        setLastName("");
        setEmail("");
        setPhotoURL("");

        if (role === EMPLOYER) {
          nav(`/${role}/input-details`);
        } else {
          nav(`/${role}/profile`);
        }

        const userResponse = await axios.get(`${BACKEND_URL}/${role}`);
        const allUserData = userResponse.data;
        console.log("allUserData", allUserData);

        const userEmails = allUserData.map((person) => person.email);
        if (userEmails.includes(user.email)) {
          const userData = allUserData.find(
            (person) => person.email === user.email
          );
          console.log("user data id", userData.id);
          console.log("useremails is actually running");
          setUserID(userData.id);
          return;
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        // Handle errors if necessary
      });
  };

  // <-----console.log for selected role----->
  useEffect(() => {
    console.log("selected role:", selectedRole);
    console.log("url:", `${BACKEND_URL}/${selectedRole}`);
    console.log("email:", email);
    console.log("first name:", firstName);
  }, [selectedRole, email, firstName]);

  return (
    <>
      <div className="cat-container">
        <h1 className="cat-title"> Are you an employer or talent?</h1>

        <CustomButton onClick={() => handleSelection(EMPLOYER)}>
          <h4>I am an employer. </h4>
          <img
            src="employer.png"
            style={{
              width: "65%",
              height: "auto",
            }}
          />
        </CustomButton>

        <br />
        <br />
        <CustomButton onClick={() => handleSelection(TALENT)}>
          <h4>I am a talent. </h4>
          <img
            src="talent.png"
            style={{
              width: "65%",
              height: "auto",
            }}
          />
        </CustomButton>
        <p className="cat-tnc">
          Your selection is final and cannot be altered after this stage. Thank
          you.
        </p>
      </div>
    </>
  );
}
