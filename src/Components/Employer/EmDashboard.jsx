import { useState, useEffect } from "react";
import { useUser } from "../Context/UserContext";
import { OutlinedCard } from "../../MUIComponents";

import { Fab } from "@mui/material";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";

import { useNavigate } from "react-router-dom";
const BACKEND_EMPLOYER_URL = import.meta.env.VITE_SOME_BACKEND_EMPLOYER_URL;

import axios from "axios";

//route is /employer
export default function EmDashboard() {
  const navigate = useNavigate();
  //get data from the employer joblisting backend. use it to populate job listing dashboard
  const { userFirstName, userID } = useUser();

  const [joblistings, setJobListings] = useState([]);

  useEffect(() => {
    axios
      .get(`${BACKEND_EMPLOYER_URL}/${userID}/job`)
      .then((response) => {
        setJobListings(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  useEffect(() => {
    console.log("i am joblistings:", joblistings);
  }, [joblistings]);

  let alljoblistings = joblistings.map((joblisting) => (
    <>
      <OutlinedCard
        jobTitle={joblisting.jobTitle}
        applicationStartDate={joblisting.applicationStartDate}
        applicationEndDate={joblisting.applicationEndDate}
        description={joblisting.description}
        joblistingID={joblisting.id}
        employerID={userID}
      ></OutlinedCard>
    </>
  ));

  return (
    <>
      <div className="container">
        <h1 className="centered">{userFirstName}'s Employer Dashboard </h1>

        <h3 className="box">Active Job Listings</h3>
        {/*if the active job listings is empty, show the text:*/}

        {joblistings ? (
          alljoblistings
        ) : (
          <p>You have no job listings at the moment!</p>
          /*BUG !! the alljoblistings variable will always exist, so the text after this will never be shown.*/
        )}

        <Fab
          color="primary"
          aria-label="add"
          onClick={() => navigate(`${userID}/job`)}
          sx={{
            position: "fixed",
            bottom: "80px", // Adjust as needed
            left: "calc(50%)", // Center horizontally
            transform: "translateX(-50%) rotate(45deg)", // Center horizontally
            zIndex: "999", // Ensures it stays on top of other content
            backgroundColor: "rgba(119, 101, 227,0.8)",
            color: "white",
            "&:hover": {
              bgcolor: "rgb(138, 129, 124)",
            },
            "&:hover svg": {
              color: "black",
            },
          }}
        >
          <ClearRoundedIcon />
        </Fab>
      </div>
    </>
  );
}
