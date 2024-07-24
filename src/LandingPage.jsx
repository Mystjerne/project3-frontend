import "./LandingPage.css";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "antd";
import { buttonStyle } from "./styleComponents";
import styled from "styled-components";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "./Components/Context/UserContext";

const BACKEND_TALENT_URL = import.meta.env.VITE_SOME_BACKEND_TALENT_URL;
const BACKEND_EMPLOYER_URL = import.meta.env.VITE_SOME_BACKEND_EMPLOYER_URL;

const CustomButton = styled(Button)`
  ${buttonStyle}
`;

export default function LandingPage() {
  const { isAuthenticated, user } = useAuth0();
  const {
    setUserFirstName,
    setUserLastName,
    setUserImage,
    setUserEmail,
    setUserRole,
    setUserID,
    setDescription,
    setCompanyName,
    setMissionStatement,
    setPhone,
    setHeadquarters,
  } = useUser();

  const nav = useNavigate();

  // Log user info for debugging
  useEffect(() => {
    if (isAuthenticated && user) {
      console.log("email - ", user.email);
      console.log("image - ", user.picture);
      console.log("user first name - ", user.given_name);
      console.log("user surname - ", user.family_name);
      console.log("emailid - ", user.nickname);
      console.log("user data", user);
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    const checkUserStatus = async () => {
      if (isAuthenticated && user) {
        try {
          // Check if user exists in the talent table
          console.log(BACKEND_TALENT_URL);
          const talentResponse = await axios.get(BACKEND_TALENT_URL);
          const talentData = talentResponse.data;
          console.log("talentData", talentResponse);

          const talentEmails = talentData.map((talent) => talent.email);
          if (talentEmails.includes(user.email)) {
            const userData = talentData.find(
              (talent) => talent.email === user.email
            );
            console.log("user data", userData);
            setUserFirstName(userData.firstName);
            setUserLastName(userData.lastName);
            setUserImage(userData.photo); // Assuming photo is a URL to the image
            setUserEmail(userData.email);
            setUserID(userData.id);
            setUserRole("talent");
            nav("/talent");
            return;
          }

          // Check if user exists in the employer table
          const employerResponse = await axios.get(BACKEND_EMPLOYER_URL);
          const employerData = employerResponse.data;
          console.log("employer data", employerData);

          const employerEmails = employerData.map((employer) => employer.email);
          if (employerEmails.includes(user.email)) {
            const userData = employerData.find(
              (employer) => employer.email === user.email
            );
            console.log("user data", userData);
            setUserFirstName(userData.firstName);
            setUserLastName(userData.lastName);
            setUserImage(userData.photo);
            setUserEmail(userData.email);
            setUserID(userData.id);

            setDescription(userData.description);
            setCompanyName(userData.companyName);
            setMissionStatement(userData.missionStatement);

            setUserRole("employer");
            nav("/employer");
            return;
          }

          // If user does not exist in either talent or employer table, redirect to user category
          nav("/user-category");
        } catch (error) {
          console.error("Error checking user status:", error);
        }
      }
    };

    //Debouncing:
    //The checkUserStatus function is wrapped in a setTimeout with a 500ms delay.
    //This delay helps to ensure that isAuthenticated and user are set before the function executes.
    checkUserStatus();
  });

  const LoginButton = () => {
    const { loginWithRedirect } = useAuth0();
    return (
      <CustomButton type="primary" onClick={() => loginWithRedirect()}>
        Log In or Sign up
      </CustomButton>
    );
  };

  return (
    <div className="landing-container">
      <h1 className="landing-logo">Billboard</h1>
      <div className="landing-text-container">
        <h3 className="landing-text">Where Careers and Priorities Align.</h3>
        <LoginButton />
      </div>
    </div>
  );
}

// those sign in without email route will not have a name, they only have emailid

// if first and last name are empty, push email id to both fields (they are compulary fields on the backend)

// user sign up. push data to backend.
// collect email (prevent duplicate) when user sign up.
// only push data to backend if the email is unique
