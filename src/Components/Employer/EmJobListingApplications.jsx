import axios from "axios";

import { useAuth0 } from "@auth0/auth0-react";

import { useUser } from "../Context/UserContext";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { OutlinedCard2 } from "../../MUIComponents";

import Fab from "@mui/material/Fab";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";

import { Button } from "antd";
import styled from "styled-components";
import { buttonStyle } from "../../styleComponents";
const CustomButton = styled(Button)`
  ${buttonStyle}
`;

const BACKEND_EMPLOYER_URL = import.meta.env.VITE_SOME_BACKEND_EMPLOYER_URL;
const BACKEND_TALENT_URL = import.meta.env.VITE_SOME_BACKEND_TALENT_URL;

//this is where they can accept or deny applications for specific job listings.
//"/:employerId/job/:jobListingId"

export default function EmJobListingApplications() {
  const { isAuthenticated, user } = useAuth0();
  //need to get a list of all applications in relation io the joblisting.
  //need to send a post request to the application controller method switching it's status from PENDING to either ACCEPTED or DENIED.
  const { userID } = useUser();
  //get job listing id from the params?????? look at bigfoot
  const [jobapplications, setJobApplications] = useState([]);

  const [jobListing, setJobListing] = useState([]);
  const params = useParams();
  const jobListingId = params.jobListingId;

  const [allApplicantResumes, setAllApplicantResumes] = useState([]);
  const [currentApplicantResume, setCurrentApplicantResumes] = useState([]);
  const [AllApplicantSkillSets, setAllApplicantSkillSets] = useState([]);
  const [AllApplicantWorkExp, setAllApplicantWorkExp] = useState([]);
  const [AllApplicantEducations, setAllApplicantEducations] = useState([]);
  const [AllApplicantBenefits, setAllApplicantBenefits] = useState([]);

  useEffect(() => {
    //get the specific job listing data.
    //also get all applications associated with that job listing.
    axios
      .get(`${BACKEND_EMPLOYER_URL}/${userID}/job/${jobListingId}`)
      .then((response) => {
        const joblistingdata = response.data.jobListing;
        const joblistingappdata = response.data.applications;

        console.log(response.data);
        setJobApplications(joblistingappdata);
        setJobListing(joblistingdata);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const handleAcceptApplication = (applicationId, talentId) => {
    //make a backend route that changes the status of the application from pending to accept
    console.log("handleAcceptApplication called");
    axios
      .put(`${BACKEND_TALENT_URL}/${talentId}/applications`, {
        applicationStatus: "Accepted",
        applicationId: applicationId,
      })
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
    alert("Application accepted!");
  };

  const handleDenyApplication = (applicationId, talentId) => {
    //make a backend route that changes the status of the application from pending to accept
    console.log("handleAcceptApplication called");
    axios
      .put(`${BACKEND_TALENT_URL}/${talentId}/applications`, {
        applicationStatus: "Denied",
        applicationId: applicationId,
      })
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
    alert("Application denied!");
  };

  //it would be nice to get a single application at a time
  //but i can only get talentids through getting all applications so idk

  //get the ids of all the talents that have made an application in order. put that into a state.
  //using the ids of all the talents, get the resumes of all talents and put that into a state
  //do this for talent's skillset, benefits, work experiences and talent education

  useEffect(() => {
    const talentids = jobapplications.map(
      (jobapplication) => jobapplication.talentId
    );
    console.log("talentids", talentids);
    getAllTalentResumes(talentids);
    getAllTalentSkillSets(talentids);
    getAllTalentWorkExp(talentids);
    getAllTalentEducations(talentids);
    getAllTalentBenefits(talentids);
  }, [jobapplications]);

  const getAllTalentResumes = (talentids) => {
    console.log("getAllTalentResumes is being called");
    //map takes in a talentid and returns a promise.
    const talentResumePromises = talentids.map((talentid) => {
      return axios
        .get(`${BACKEND_TALENT_URL}/${talentid}/resume`)
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    });
    //talentResumePromises is just a bunch of promises. need to wait for them to resolve.
    Promise.all(talentResumePromises).then((values) =>
      setAllApplicantResumes(values)
    );
  };

  const getAllTalentSkillSets = (talentids) => {
    //map takes in a talentid and returns a promise.
    const talentSkillSetPromises = talentids.map((talentid) => {
      return axios
        .get(`${BACKEND_TALENT_URL}/${talentid}/skill`)
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    });
    //talentResumePromises is just a bunch of promises. need to wait for them to resolve.
    Promise.all(talentSkillSetPromises).then((values) =>
      setAllApplicantSkillSets(values)
    );
  };

  const getAllTalentWorkExp = (talentids) => {
    //map takes in a talentid and returns a promise.
    const talentWorkExpPromises = talentids.map((talentid) => {
      return axios
        .get(`${BACKEND_TALENT_URL}/${talentid}/workexperience`)
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    });
    //talentResumePromises is just a bunch of promises. need to wait for them to resolve.
    Promise.all(talentWorkExpPromises).then((values) =>
      setAllApplicantWorkExp(values)
    );
  };

  const getAllTalentEducations = (talentids) => {
    //map takes in a talentid and returns a promise.
    const talentEducationsPromises = talentids.map((talentid) => {
      return axios
        .get(`${BACKEND_TALENT_URL}/${talentid}/education`)
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    });
    //talentResumePromises is just a bunch of promises. need to wait for them to resolve.
    Promise.all(talentEducationsPromises).then((values) =>
      setAllApplicantEducations(values)
    );
  };

  const getAllTalentBenefits = (talentids) => {
    console.log("getAllTalentBenefits is being called");
    //map takes in a talentid and returns a promise.
    const talentBenefitsPromises = talentids.map((talentid) => {
      return axios
        .get(`${BACKEND_TALENT_URL}/${talentid}/benefits`)
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    });

    Promise.all(talentBenefitsPromises).then((values) =>
      setAllApplicantBenefits(values)
    );
  };

  let alljoblistingApplication = jobapplications.map((jobapplication) => (
    <>
      <div className="contentbox">
        {jobapplication.talentId}
        <CustomButton
          onClick={() =>
            handleAcceptApplication(jobapplication.id, jobapplication.talentId)
          }
        >
          Accept
        </CustomButton>
        <CustomButton
          onClick={() =>
            handleDenyApplication(jobapplication.id, jobapplication.talentId)
          }
        >
          Deny
        </CustomButton>
      </div>
    </>
  ));

  //As of right now, it's hard coded to only display the first application to the job listing.
  //Potential improvements: have it change
  return (
    <div className="container">
      <h3 className="box">Job Listing no. {jobListingId}</h3>
      <OutlinedCard2
        jobTitle={jobListing.jobTitle}
        applicationStartDate={jobListing.applicationStartDate}
        applicationEndDate={jobListing.applicationEndDate}
        description={jobListing.description}
        skillSet={jobListing.skillSet}
        jobResponsibility={jobListing.jobResponsibility}
      />
      {/*Make this a talent id:*/}
      <h3 className="box">Applicant no.1</h3>
      {/*Display talent's resume here.*/}
      <h5 className="box">They consider themselves to be a:</h5>
      {allApplicantResumes?.[0]?.title}
      <h5 className="box">Their objective:</h5>
      {allApplicantResumes &&
        allApplicantResumes[0] &&
        allApplicantResumes[0][0].objective}
      <h5 className="box">They are proficient in:</h5>
      {AllApplicantSkillSets &&
        AllApplicantSkillSets[0] &&
        AllApplicantSkillSets[0][0].skill}{" "}
      at an&nbsp;
      {AllApplicantSkillSets &&
        AllApplicantSkillSets[0] &&
        AllApplicantSkillSets[0][0].proficiencyLevel}
      &nbsp;level.
      <h5 className="box">They have the following work experiences:</h5>
      {AllApplicantWorkExp &&
        AllApplicantWorkExp[0] &&
        AllApplicantWorkExp[0][0].position}
      , having worked there from&nbsp;
      {AllApplicantWorkExp &&
        AllApplicantWorkExp[0] &&
        AllApplicantWorkExp[0][0].startMonth}
      &nbsp;
      {AllApplicantWorkExp &&
        AllApplicantWorkExp[0] &&
        AllApplicantWorkExp[0][0].startYear}
      &nbsp;to&nbsp;
      {AllApplicantWorkExp &&
        AllApplicantWorkExp[0] &&
        AllApplicantWorkExp[0][0].endMonth}
      &nbsp;
      {AllApplicantWorkExp &&
        AllApplicantWorkExp[0] &&
        AllApplicantWorkExp[0][0].endYear}
      <h5 className="box">They studied at:</h5>
      {AllApplicantEducations &&
        AllApplicantEducations[0] &&
        AllApplicantEducations[0][0].institution}
      , obtaining a&nbsp;
      {AllApplicantEducations &&
        AllApplicantEducations[0] &&
        AllApplicantEducations[0][0].degree}
      .<h5 className="box">They prioritize the following:</h5>
      {AllApplicantBenefits &&
        AllApplicantBenefits[0]?.benefits[0]?.description}
      <br></br>
      {AllApplicantBenefits &&
        AllApplicantBenefits[0]?.benefits[1]?.description}
      <br></br>
      {AllApplicantBenefits &&
        AllApplicantBenefits[0]?.benefits[2]?.description}
      <Fab
        color="primary"
        aria-label="add"
        onClick={() =>
          handleDenyApplication(
            jobapplications[0].id,
            jobapplications[0].talentId
          )
        }
        sx={{
          position: "fixed",
          bottom: "80px", // Adjust as needed
          left: "calc(50% - 55px)", // Center horizontally
          transform: "translateX(-50%)", // Center horizontally
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
      <Fab
        aria-label="like"
        onClick={() =>
          handleAcceptApplication(
            jobapplications[0].id,
            jobapplications[0].talentId
          )
        }
        sx={{
          position: "fixed",
          bottom: "80px", // Adjust as needed
          left: "calc(50% + 55px)", // Center horizontally
          transform: "translateX(-50%)", // Center horizontally
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
        <FavoriteIcon />
      </Fab>
    </div>
  );
}
