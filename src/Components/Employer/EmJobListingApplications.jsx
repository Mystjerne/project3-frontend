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

  const [currentApplicantResume, setCurrentApplicantResume] = useState(0);

  const [allApplicantResumes, setAllApplicantResumes] = useState([]);
  const [AllApplicantSkillSets, setAllApplicantSkillSets] = useState([]);
  const [AllApplicantWorkExp, setAllApplicantWorkExp] = useState([]);
  const [AllApplicantEducations, setAllApplicantEducations] = useState([]);
  const [AllApplicantBenefits, setAllApplicantBenefits] = useState([]);

  const [total_num_applications, setTotalNumApplications] = useState(null);

  useEffect(() => {
    //get the specific job listing data.
    //also get all applications associated with that job listing.
    axios
      .get(`${BACKEND_EMPLOYER_URL}/${userID}/job/${jobListingId}`)
      .then((response) => {
        const joblistingdata = response.data.jobListing;
        const joblistingappdata = response.data.applications;

        setJobApplications(joblistingappdata);
        setJobListing(joblistingdata);
        console.log("joblistingappdata: ", joblistingappdata);
        console.log("joblistingdata:", joblistingdata);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  useEffect(() => {
    console.log("allApplicantResumes:", allApplicantResumes);
    setTotalNumApplications(allApplicantResumes.length);
    console.log("total_num_applications:", total_num_applications);
  }, [allApplicantResumes]);

  //When an application is accepted or denied, set the currentResume to +1.
  //On initliasing, the currentResume is 0.

  const handleAcceptApplication = (applicationId, talentId) => {
    //make a backend route that changes the status of the application from pending to accept
    console.log("handleAcceptApplication called");
    axios
      .put(`${BACKEND_TALENT_URL}/${talentId}/applications`, {
        applicationStatus: "Accepted",
        applicationId: applicationId,
      })
      .then((response) => {
        //console.log(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
    alert("Application accepted!");
    setCurrentApplicantResume(currentApplicantResume + 1);
    console.log("currentApplicantResume:", currentApplicantResume);
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
        //console.log(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });

    alert("Application denied!");
    setCurrentApplicantResume(currentApplicantResume + 1);
    console.log("currentApplicantResume:", currentApplicantResume);
  };

  useEffect(() => {
    const talentids = jobapplications.map(
      (jobapplication) => jobapplication.talentId
    );
    //console.log("talentids", talentids);
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

  const isDataAvailable =
    allApplicantResumes.length > 0 &&
    allApplicantResumes[0] &&
    AllApplicantSkillSets.length > 0 &&
    AllApplicantSkillSets[0] &&
    AllApplicantWorkExp.length > 0 &&
    AllApplicantWorkExp[0] &&
    AllApplicantEducations.length > 0 &&
    AllApplicantEducations[0] &&
    AllApplicantBenefits.length > 0 &&
    AllApplicantBenefits[0] &&
    AllApplicantBenefits[0].benefits &&
    AllApplicantBenefits[0].benefits.length > 0;

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
      {isDataAvailable && currentApplicantResume < total_num_applications ? (
        <>
          <h3 className="box">Applicant no. {currentApplicantResume + 1}</h3>
          {/*Display talent's resume here.*/}
          <h5 className="box">They consider themselves to be a:</h5>
          {allApplicantResumes[currentApplicantResume][0].title}
          <h5 className="box">Their objective:</h5>
          {allApplicantResumes[currentApplicantResume][0].objective}
          <h5 className="box">They are proficient in:</h5>
          {AllApplicantSkillSets[currentApplicantResume].map(
            (skillSet, index) => (
              <div key={index}>
                <div>
                  {skillSet.skill} at an {skillSet.proficiencyLevel} level.
                </div>
                <hr />
              </div>
            )
          )}
          <h5 className="box">They have the following work experiences:</h5>
          {AllApplicantWorkExp[currentApplicantResume].map((workExp, index) => (
            <div key={index}>
              <div>
                {workExp.position} from&nbsp;
                {workExp.startMonth} {workExp.startYear} to&nbsp;
                {workExp.endYear
                  ? `${workExp.endMonth} ${workExp.endYear}`
                  : "Present"}
              </div>
              <hr />
            </div>
          ))}
          <h5 className="box">They have the following education:</h5>

          {AllApplicantEducations[currentApplicantResume].map(
            (education, index) => (
              <div key={index}>
                <div>
                  {education.degree} at the {education.institution}
                </div>
                <hr />
              </div>
            )
          )}
          <h5 className="box">They prioritize the following:</h5>
          {AllApplicantBenefits &&
            AllApplicantBenefits[currentApplicantResume]?.benefits[0]?.category}
          <br />
          <p className="wp-duration">
            {" "}
            {AllApplicantBenefits &&
              AllApplicantBenefits[currentApplicantResume]?.benefits[0]
                ?.description}
          </p>
          <hr />
          {AllApplicantBenefits &&
            AllApplicantBenefits[currentApplicantResume]?.benefits[1]?.category}
          <br></br>
          <p className="wp-duration">
            {AllApplicantBenefits &&
              AllApplicantBenefits[currentApplicantResume]?.benefits[1]
                ?.description}
          </p>
          <hr />
          {AllApplicantBenefits &&
            AllApplicantBenefits[currentApplicantResume]?.benefits[2]?.category}
          <p className="wp-duration">
            {AllApplicantBenefits &&
              AllApplicantBenefits[currentApplicantResume]?.benefits[2]
                ?.description}
          </p>
          <hr />
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
        </>
      ) : (
        <p>There are currently no applicants to this job listing.</p>
      )}
    </div>
  );
}
