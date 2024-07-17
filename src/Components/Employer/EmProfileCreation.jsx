import { useState, useEffect, useRef } from "react";

import { Link, Outlet, useLocation } from "react-router-dom";
import { storage } from "../../firebase";

import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

import { Button } from "antd";
import styled from "styled-components";
import {
  buttonStyle,
  profileImage,
  reversedOutlineButton,
} from "../../styleComponents";
import { Avatar } from "@mui/material";
import { PlusOutlined } from "@ant-design/icons";

const CustomProfileImage = styled(Avatar)`
  ${profileImage}
`;

const ReversedCustomButton = styled(Button)`
  ${reversedOutlineButton}
`;

import EditIcon from "@mui/icons-material/Edit";
import BasicModal from "./BasicModal";

import { useUser } from "../Context/UserContext";

import axios from "axios";
import NavBar from "../../NavBar";

const BACKEND_EMPLOYER_URL = import.meta.env.VITE_SOME_BACKEND_EMPLOYER_URL;
const CustomButton = styled(Button)`
  ${buttonStyle}
`;

// Employers need to be able to input the following general info:
// name
// description
// photo

export default function EmProfileCreation() {
  const {
    userFirstName,
    userLastName,
    userEmail,
    userID,
    companyName,
    setCompanyName,
    description,
    setDescription,
    imgurl,
    setImageUrl,
    phone,
    setPhone,
    headquarters,
    setHeadquarters,
    missionStatement,
    setMissionStatement,
  } = useUser();

  const [submitted_image, setSubmittedImage] = useState(false);

  const [modalState, setModalState] = useState({
    opencompanyNameModal: false,
    opendescriptionModal: false,
    openHeadquartersModal: false,
    openMissionStatementModal: false,
    openPhoneModal: false,
  });

  const location = useLocation();
  const [editing, setEditing] = useState(false);
  const [fileInputFile, setFileInputFile] = useState({});
  const DB_STORAGE_KEY = "company_image";

  //reference to the
  const fileInputRef = useRef(null);

  //If the user navigated to this page from any other page than the Employer profile page, editing is not set to true.
  //We assume that the user is inputting a new profile for the first time.
  useEffect(() => {
    if (location.state && location.state.editing) {
      setEditing(location.state.editing);
    }
  }, [location.state]);

  const handleSubmitImgToFirebase = () => {
    setSubmittedImage(true);
    const storageRefInstance = storageRef(
      storage,
      DB_STORAGE_KEY + "/" + fileInputFile.name
    );

    try {
      uploadBytes(storageRefInstance, fileInputFile).then(() => {
        getDownloadURL(storageRefInstance).then((url) => {
          setImageUrl(url);
        });
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handleModalOpen = (modalName) => {
    setModalState((prevState) => ({ ...prevState, [modalName]: true }));
  };

  const handleSubmitEmData = () => {
    if (editing) {
      const updateEmployerData = async () => {
        try {
          // make a HTTP POST request to the backend.
          let response = await axios.post(`${BACKEND_EMPLOYER_URL}/${userID}`, {
            description: description,
            companyName: companyName,
            firstName: userFirstName,
            lastName: userLastName,
            email: userEmail,
            photo: imgurl,
            phone: phone,
            missionStatement: missionStatement,
            headquarters: headquarters,
          });
        } catch (err) {
          console.log(err);
        }
      };
      updateEmployerData();

      alert("Updated employer data!");
    } else {
      const createEmployerData = async () => {
        try {
          // make a HTTP POST request to the backend.
          let response = await axios.post(`${BACKEND_EMPLOYER_URL}`, {
            description: description,
            companyName: companyName,
            firstName: userFirstName,
            lastName: userLastName,
            email: userEmail,
            photo: imgurl,
            phone: phone,
            headquarters: headquarters,
            missionStatement: missionStatement,
          });
        } catch (err) {
          console.log(err);
        }
      };
      createEmployerData();

      alert("Updated employer data!");
    }
  };

  const callClickOnInput = () => {
    fileInputRef.current.click();
  };

  //after the file input file is changed, submit it to firebase immediately.
  useEffect(() => {
    handleSubmitImgToFirebase();
  }, [fileInputFile]);

  return (
    <div className="container">
      {/*Code Handling Company Profile Image changes*/}
      <div
        className="company-img-div"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h1>{editing ? "Edit Profile" : "Profile Creation"}</h1>
        {/* Firebase storage stuff for the Employer Profile Picture here. */}
        {submitted_image ? (
          <CustomProfileImage src={imgurl} />
        ) : (
          <CustomProfileImage src="../../public/defaultprofileimg.jpg" />
        )}

        {/*Upload Image Button*/}
        <ReversedCustomButton onClick={callClickOnInput}>
          <PlusOutlined /> Upload Image
        </ReversedCustomButton>
        <input
          ref={fileInputRef}
          style={{ display: "none" }}
          type="file"
          onChange={(e) => setFileInputFile(e.target.files[0])}
        />
        <br />
      </div>

      {/* Code handling Company Name */}
      <h3 className="box">
        Company Name
        <CustomButton onClick={() => handleModalOpen("opencompanyNameModal")}>
          <EditIcon />
        </CustomButton>
      </h3>
      <BasicModal
        modaltitle="Company Name:"
        modaldescription="What does everyone call your company?"
        open={modalState.opencompanyNameModal}
        setOpen={(value) =>
          setModalState({ ...modalState, opencompanyNameModal: value })
        }
        propertyname="companyName"
        passedInState={companyName}
        setPassedInState={setCompanyName}
        multiline={false}
      />
      <h3>{companyName}</h3>
      {/* Code handling Company Description */}
      <h3 className="box">
        About The Company
        <CustomButton onClick={() => handleModalOpen("opendescriptionModal")}>
          <EditIcon />
        </CustomButton>
      </h3>
      <BasicModal
        modaltitle="Company Description:"
        modaldescription="Tell prospective job applicants what your company is all about!"
        open={modalState.opendescriptionModal}
        setOpen={(value) =>
          setModalState({ ...modalState, opendescriptionModal: value })
        }
        propertyname="description"
        passedInState={description}
        setPassedInState={setDescription}
        multiline={true}
      />
      <p style={{ wordWrap: "break-word" }} className="contentbox">
        {description}
      </p>

      {/* Code handling Company Phone */}
      <h3 className="box">
        Company Phone
        <CustomButton onClick={() => handleModalOpen("openPhoneModal")}>
          <EditIcon />
        </CustomButton>
      </h3>
      <BasicModal
        modaltitle="Company Phone:"
        modaldescription="What is the phone number for your company?"
        open={modalState.openPhoneModal}
        setOpen={(value) =>
          setModalState({ ...modalState, openPhoneModal: value })
        }
        propertyname="phone"
        passedInState={phone}
        setPassedInState={setPhone}
        multiline={false}
      />
      <h3>{phone}</h3>

      {/* Code handling Company Headquarters */}
      <h3 className="box">
        Company Headquarters
        <CustomButton onClick={() => handleModalOpen("openHeadquartersModal")}>
          <EditIcon />
        </CustomButton>
      </h3>
      <BasicModal
        modaltitle="Company Headquarters:"
        modaldescription="Where is the headquarters of your company located?"
        open={modalState.openHeadquartersModal}
        setOpen={(value) =>
          setModalState({ ...modalState, openHeadquartersModal: value })
        }
        propertyname="headquarters"
        passedInState={headquarters}
        setPassedInState={setHeadquarters}
        multiline={false}
      />
      <h3>{headquarters}</h3>

      {/* Code handling Company Mission Statement */}
      <h3 className="box">
        Company Mission Statement
        <CustomButton
          onClick={() => handleModalOpen("openMissionStatementModal")}
        >
          <EditIcon />
        </CustomButton>
      </h3>

      <BasicModal
        modaltitle="Company Mission Statement:"
        modaldescription="What is the mission statement of your company?"
        open={modalState.openMissionStatementModal}
        setOpen={(value) =>
          setModalState({ ...modalState, openMissionStatementModal: value })
        }
        propertyname="missionStatement"
        passedInState={missionStatement}
        setPassedInState={setMissionStatement}
        multiline={true}
      />
      <p style={{ wordWrap: "break-word" }} className="contentbox">
        {missionStatement}
      </p>

      {/* <CustomButton className="center" onClick={() => handleSubmitEmData()}>
        Submit
      </CustomButton> */}
      <CustomButton className="right" onClick={() => handleSubmitEmData()}>
        <Link to={`/employer/${userID}/job`}>Next</Link>
      </CustomButton>
      {editing && <NavBar />}
    </div>
  );
}
