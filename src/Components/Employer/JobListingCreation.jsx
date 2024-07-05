import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "antd";
import styled from "styled-components";
import { buttonStyle } from "../../styleComponents";

import { useAuth0 } from "@auth0/auth0-react";
import BenefitSelection from "../Benefits/BenefitSelection";
import { useUser } from "../Context/UserContext";
import BasicModal from "./BasicModal";
import EditIcon from "@mui/icons-material/Edit";

//when i tried to download @mui/x-datewhateveyr it ruined the package.json and node_modules of this project, bricking the main page.
// import { createTheme } from "@mui/material/styles";
// import { MobileDatePicker } from/MobileDatePicker";

import { Link } from "react-router-dom";

const BACKEND_URL = import.meta.env.VITE_SOME_BACKEND_URL;
const BACKEND_EMPLOYER_URL = import.meta.env.VITE_SOME_BACKEND_EMPLOYER_URL;

const CustomButton = styled(Button)`
  ${buttonStyle}
`;

//Employers need to be able to input the following info when creating a job listing:
//name c
//description
//job_responsibilities
//skill_set
//three of the best company_benefits this job has to offer

export default function JobListingCreation() {
  //User related states from the useContext
  const {
    userID,
    description,
    setDescription,
    companyName,
    setCompanyName,
    imgurl,
    setImageUrl,
  } = useUser();

  //Authentification
  const { isAuthenticated, user } = useAuth0();

  const [jobBenefits, setJobBenefits] = useState("");

  const [modalState, setModalState] = useState({
    openJobTitleModal: false,
    openJobResponsibilityModal: false,
    openSkillsetModal: false,
    openJobDescriptionModal: false,
    openJobApplicationStartModal: false,
    openJobApplicationEndModal: false,
  });

  const [joblistinginfo, setJobListingInfo] = useState({
    jobTitle: "",
    description: "",
    jobResponsibility: "",
    skillSet: "",
    applicationStartDate: "",
    applicationEndDate: "",
    benefit1: -1,
    benefit2: -1,
    benefit3: -1,
  });

  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/benefits`)
      .then((response) => {
        setJobBenefits(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  //when posting the job listing, have to update both the tables:
  //job_listing_benefits and job_listing at the same time.
  //after making sure that the values in the request are valid
  //for example, that if i put in a benefit id of like 200
  //it won't work

  const handleModalOpen = (modalName) => {
    setModalState((prevState) => ({ ...prevState, [modalName]: true }));
  };

  const handleBenefit = (value, name) => {
    //this is only triggered once a benefit has been selected.
    console.log("i am the name passed into handleBenefit", value);
    setJobListingInfo((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  useEffect(() => {
    console.log("jobBenefits", jobBenefits);
  }, [jobBenefits]);

  useEffect(() => {
    console.log("joblisting", joblistinginfo);
  }, [joblistinginfo]);

  const handleSubmit = (e) => {
    e.preventDefault();
    //on Submit, make a post request to the backend.
    const sendJobListingData = async () => {
      try {
        //make a http POST request to the backend.
        let response = await axios.post(
          `${BACKEND_EMPLOYER_URL}/${userID}/job`,
          {
            ...joblistinginfo,
          }
        );
      } catch (err) {
        console.log(err);
      }
    };

    sendJobListingData();

    alert("Submitted joblisting data!");
  };

  return (
    <div className="container">
      <h1>Job Listing Creation</h1>
      <h3 className="box">
        Job Title@{companyName}
        <CustomButton onClick={() => handleModalOpen("openJobTitleModal")}>
          <EditIcon />
        </CustomButton>
      </h3>
      <h3>{joblistinginfo.jobTitle}</h3>
      <BasicModal
        modaltitle="Enter your job's title:"
        modaldescription=""
        open={modalState.openJobTitleModal}
        setOpen={(value) =>
          setModalState({ ...modalState, openJobTitleModal: value })
        }
        propertyname="jobTitle"
        passedInState={joblistinginfo}
        setPassedInState={setJobListingInfo}
        multiline={false}
      ></BasicModal>
      <h3 className="box">
        Job Responsibiliies
        <CustomButton
          onClick={() => {
            handleModalOpen("openJobResponsibilityModal");
          }}
        >
          <EditIcon />
        </CustomButton>
      </h3>
      <p style={{ wordWrap: "break-word" }}>
        {joblistinginfo.jobResponsibility}
      </p>
      <BasicModal
        modaltitle="Enter your job's responsibilities:"
        modaldescription=""
        open={modalState.openJobResponsibilityModal}
        setOpen={(value) =>
          setModalState({ ...modalState, openJobResponsibilityModal: value })
        }
        propertyname="jobResponsibility"
        passedInState={joblistinginfo}
        setPassedInState={setJobListingInfo}
        multiline={true}
      ></BasicModal>
      <h3 className="box">
        Skill Set Required
        <CustomButton
          onClick={() => {
            handleModalOpen("openSkillsetModal");
          }}
        >
          <EditIcon />
        </CustomButton>
      </h3>
      <p>{joblistinginfo.skillSet}</p>
      <BasicModal
        modaltitle="Enter the required skillset:"
        modaldescription=""
        open={modalState.openSkillsetModal}
        setOpen={(value) =>
          setModalState({ ...modalState, openSkillsetModal: value })
        }
        propertyname="skillSet"
        passedInState={joblistinginfo}
        setPassedInState={setJobListingInfo}
        multiline={true}
      ></BasicModal>
      <h3 className="box">
        Job Description
        <CustomButton
          onClick={() => {
            handleModalOpen("openJobDescriptionModal");
          }}
        >
          <EditIcon />
        </CustomButton>
      </h3>
      <p style={{ wordWrap: "break-word" }}>{joblistinginfo.description}</p>
      <BasicModal
        modaltitle="Enter your job's description:"
        modaldescription=""
        open={modalState.openJobDescriptionModal}
        setOpen={(value) =>
          setModalState({ ...modalState, openJobDescriptionModal: value })
        }
        propertyname="description"
        passedInState={joblistinginfo}
        setPassedInState={setJobListingInfo}
        multiline={true}
      ></BasicModal>
      <h3 className="box">
        Job Application Start
        <CustomButton
          onClick={() => {
            handleModalOpen("openJobApplicationStartModal");
          }}
        >
          <EditIcon />
        </CustomButton>
      </h3>
      <p style={{ wordWrap: "break-word" }}>
        {joblistinginfo.applicationStartDate}
      </p>
      <BasicModal
        modaltitle="Enter your job listing's starting date for applications:"
        modaldescription="eg. 2024-03-01 REMOVE THIS LATER"
        open={modalState.openJobApplicationStartModal}
        setOpen={(value) =>
          setModalState({ ...modalState, openJobApplicationStartModal: value })
        }
        propertyname="applicationStartDate"
        passedInState={joblistinginfo}
        setPassedInState={setJobListingInfo}
        multiline={true}
      ></BasicModal>

      <h3 className="box">
        Job Application End
        <CustomButton
          onClick={() => {
            handleModalOpen("openJobApplicationEndModal");
          }}
        >
          <EditIcon />
        </CustomButton>
      </h3>
      <p style={{ wordWrap: "break-word" }}>
        {joblistinginfo.applicationEndDate}
      </p>
      <BasicModal
        modaltitle="Enter your job listing's ending date for applications:"
        modaldescription="eg. 2024-03-01 REMOVE THIS LATER"
        open={modalState.openJobApplicationEndModal}
        setOpen={(value) =>
          setModalState({ ...modalState, openJobApplicationEndModal: value })
        }
        propertyname="applicationEndDate"
        passedInState={joblistinginfo}
        setPassedInState={setJobListingInfo}
        multiline={true}
      ></BasicModal>
      <p>
        Today's job seekers have different priorities. What are the three best
        benefits your job offers?
      </p>
      <BenefitSelection
        labelName={"Benefit 1"}
        name="benefit1"
        onChange={(value) => {
          handleBenefit(value, "benefit1");
        }}
        value={joblistinginfo.benefit1}
      />
      <br></br>
      <BenefitSelection
        labelName={"Benefit 2"}
        name="benefit2"
        onChange={(value) => {
          handleBenefit(value, "benefit2");
        }}
        value={joblistinginfo.benefit2}
      />
      <br></br>
      <BenefitSelection
        labelName={"Benefit 3"}
        name="benefit3"
        onChange={(value) => {
          handleBenefit(value, "benefit3");
        }}
        value={joblistinginfo.benefit3}
      />
      <CustomButton onClick={handleSubmit}>Submit</CustomButton>
      <br></br>
      <CustomButton>
        <Link to="/employer/">Next</Link>
      </CustomButton>
    </div>
  );
}
