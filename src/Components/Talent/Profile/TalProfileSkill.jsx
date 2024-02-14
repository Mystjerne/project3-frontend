import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import { useUser } from "../../Context/UserContext";
import { PopUpModal, SingleLineTextField } from "../../../MUIComponents";
import { BACKEND_TALENT_URL } from "../../../../constants";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import styled from "styled-components";
import { editIcon } from "../../../styleComponents";

const CustomIcon = styled(IconButton)`
  ${editIcon}
`;

export default function TalProfileSkill() {
  const { isAuthenticated } = useAuth0();
  const { userID } = useUser();

  //current data
  const [skillModal, setSkillModal] = useState(false);
  const [skillData, setSkillData] = useState([]);

  //new skill set
  const [newSkillModal, setNewSkillModal] = useState(false);
  const [newSkill, setNewSkill] = useState("");
  const [newProficiencyLevel, setNewProficiencyLevel] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      const fetchSkills = async () => {
        try {
          const skillResponse = await axios.get(
            `${BACKEND_TALENT_URL}/${userID}/skill`
          );
          setSkillData(skillResponse.data);
        } catch (error) {
          console.error("Error fetching skills:", error);
        }
      };
      fetchSkills();
    }
  }, [isAuthenticated, userID]);

  const handleOpenNewSkill = () => {
    setNewSkillModal(true);
  };

  const handleCloseNewSkill = () => {
    setNewSkillModal(false);
  };

  const handleSaveNewSkill = async () => {
    try {
      await axios.post(`${BACKEND_TALENT_URL}/${userID}/skill`, {
        skill: newSkill,
        proficiencyLevel: newProficiencyLevel,
      });

      // After saving, refetch the skills to update the UI
      const updatedSkillResponse = await axios.get(
        `${BACKEND_TALENT_URL}/${userID}/skill`
      );
      setSkillData(updatedSkillResponse.data);

      // Reset the input fields
      setNewSkill("");
      setNewProficiencyLevel("");
      setNewSkillModal(false);

      console.log("New skill added successfully!");
    } catch (error) {
      console.error("Error adding new skill:", error);
    }
  };

  //CURRENT SKILL SET MODAL

  const handleOpenCurrentSkill = () => {
    setSkillModal(true);
  };

  const handleCloseCurrentSKill = () => {
    setSkillModal(false);
  };

  return (
    <>
      <div className="">
        <h3 className="box">
          Skill Sets
          <CustomIcon onClick={handleOpenNewSkill}>
            {" "}
            <AddIcon />
          </CustomIcon>
        </h3>

        <PopUpModal
          open={newSkillModal}
          handleClose={handleCloseNewSkill}
          handleSave={handleSaveNewSkill}
          title="Add Skill Set"
        >
          <SingleLineTextField
            label="Skill"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
          />
          <SingleLineTextField
            label="Proficiency Level"
            value={newProficiencyLevel}
            onChange={(e) => setNewProficiencyLevel(e.target.value)}
          />
        </PopUpModal>
      </div>

      {/* Display skills */}
      <div className="contentbox">
        {skillData.map((skill, index) => (
          <div key={index}>
            <div className="whitebox">
              <p className="wp-jobtitle2">{skill.skill}</p>
              <IconButton onClick={handleOpenCurrentSkill}>
                <EditIcon />
              </IconButton>
            </div>
            <p className="wp-level">
              Proficiency Level: {skill.proficiencyLevel}
            </p>
            <hr />
          </div>
        ))}
      </div>
      <PopUpModal
        open={skillModal}
        handleClose={handleCloseCurrentSKill}
        // handleSave={}
        title="Edit Skill Set"
      >
        <SingleLineTextField
          // value={item.endYear || ""}
          required={true}
          // onChange={(e) => handleFieldChange(index, "endYear", e.target.value)}
          label="Skill"
        />
        <SingleLineTextField
          // value={item.endYear || ""}
          required={true}
          // onChange={(e) => handleFieldChange(index, "endYear", e.target.value)}
          label="Proficiency Level"
        />
      </PopUpModal>
    </>
  );
}
