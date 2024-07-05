import { useState, useEffect } from "react";

import { Link, Outlet, useLocation } from "react-router-dom";
import { storage } from "../../firebase";

import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

import { Button } from "antd";
import styled from "styled-components";
import { buttonStyle } from "../../styleComponents";
import EditIcon from "@mui/icons-material/Edit";
import BasicModal from "./BasicModal";

import { useUser } from "../Context/UserContext";

import axios from "axios";
import NavBar from "../../NavBar";

const BACKEND_EMPLOYER_URL = import.meta.env.VITE_SOME_BACKEND_EMPLOYER_URL;
const CustomButton = styled(Button)`
  ${buttonStyle}
`;

//Employers need to be able to input the following general info:
//name
//description
//photo

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
  } = useUser();

  const [submitted_image, setSubmittedImage] = useState(false);

  const [modalState, setModalState] = useState({
    opencompanyNameModal: false,
    opendescriptionModal: false,
  });

  const location = useLocation();
  const [editing, setEditing] = useState(false);
  const [fileInputFile, setFileInputFile] = useState({});
  const DB_STORAGE_KEY = "company_image";

  useEffect(() => {
    if (location.state && location.state.editing) {
      setEditing(location.state.editing);
    }
  }, [location.state]);

  const handleSubmit = (e) => {
    e.preventDefault();

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
          //make a http POST request to the backend.
          let response = await axios.post(`${BACKEND_EMPLOYER_URL}/${userID}`, {
            description: description,
            companyName: companyName,
            firstName: userFirstName,
            lastName: userLastName,
            email: userEmail,
            photo: imgurl,
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
          //make a http POST request to the backend.
          let response = await axios.post(`${BACKEND_EMPLOYER_URL}`, {
            description: description,
            companyName: companyName,
            firstName: userFirstName,
            lastName: userLastName,
            email: userEmail,
            photo: imgurl,
          });
        } catch (err) {
          console.log(err);
        }
      };
      createEmployerData();

      alert("Updated employer data!");
    }
  };

  return (
    <div className="container">
      <div className="company-img-div">
        <h1>{editing ? "Edit Profile" : "Profile Creation"}</h1>
        {/*Firebase storage stuff for the Employer Profile Picture here.*/}
        {submitted_image ? (
          <img className="employer-avatar-img" src={imgurl} />
        ) : (
          <img
            className="employer-avatar-img"
            src="../../public/defaultprofileimg.jpg"
          />
        )}

        <form onSubmit={handleSubmit}>
          <input
            type="file"
            onChange={(e) => setFileInputFile(e.target.files[0])}
          ></input>

          <br />
          <CustomButton htmlType="submit">Upload Image</CustomButton>
        </form>
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
      ></BasicModal>
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
      ></BasicModal>
      <p style={{ wordWrap: "break-word" }} className="contentbox">
        {description}
      </p>
      <CustomButton className="center" onClick={() => handleSubmitEmData()}>
        Submit
      </CustomButton>
      <CustomButton className="right">
        <Link to={`/employer/${userID}/job`}>Next</Link>
      </CustomButton>
      {editing && <NavBar />}
    </div>
  );
}
