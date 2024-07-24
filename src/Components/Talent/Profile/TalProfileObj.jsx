import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import { useUser } from "../../Context/UserContext";
import { PopUpModal, MultilineTextFields } from "../../../MUIComponents";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import styled from "styled-components";
import { editIcon } from "../../../styleComponents";

const BACKEND_TALENT_URL = import.meta.env.VITE_SOME_BACKEND_TALENT_URL;
const CustomIcon = styled(IconButton)`
  ${editIcon}
`;

const TalProfileObj = () => {
  const { isAuthenticated } = useAuth0();
  const { userID } = useUser();
  const [objectiveField, setObjectiveField] = useState(
    "What do you want to achieve?"
  );
  const [objectiveModal, setObjectiveModal] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      const fetchResume = async () => {
        try {
          const resumeResponse = await axios.get(
            `${BACKEND_TALENT_URL}/${userID}/resume`
          );
          const resumeData = resumeResponse.data;
          console.log("data", resumeData);

          const objective = resumeData.map((item) => item.objective);

          // Check if objective array is empty
          if (objective.length === 0) {
            setObjectiveField("What do you want to achieve?");
          } else {
            setObjectiveField(objective);
          }

          console.log("objective?", objective);
        } catch (error) {
          console.error("Error fetching objectives:", error);
        }
      };

      fetchResume();
    }
  }, [isAuthenticated, userID]);

  const handleOpenObjectiveModal = () => {
    setObjectiveModal(true);
  };

  const handleCloseObjectiveModal = () => {
    setObjectiveModal(false);
  };

  const handleSaveObjective = async () => {
    try {
      // Check if resume data exists for the user
      const resumeResponse = await axios.get(
        `${BACKEND_TALENT_URL}/${userID}/resume`
      );
      console.log(resumeResponse.data.userID);
      if (resumeResponse.data.userID === null) {
        // userID not found, create new resume data
        // if (resumeResponse.data.userID === null) new users data cannot be post
        // if (resumeResponse.data.userID === undefined) can post new users data, but everyone post
        await axios.post(`${BACKEND_TALENT_URL}/${userID}/resume`, {
          userID: userID,
          objective: objectiveField,
        });
      } else {
        // If resume data exists, update the objective
        await axios.put(`${BACKEND_TALENT_URL}/${userID}/resume`, {
          objective: objectiveField,
        });
      }

      // Log success message
      console.log("Objective saved successfully!");
    } catch (error) {
      // Log error if any
      console.error("Error saving objective:", error);
    }

    // Close the modal
    setObjectiveModal(false);
  };

  return (
    <>
      <div className="">
        <h3 className="box">
          Objectives{" "}
          <CustomIcon onClick={handleOpenObjectiveModal}>
            {" "}
            <EditIcon />
          </CustomIcon>
          <PopUpModal
            open={objectiveModal}
            handleClose={handleCloseObjectiveModal}
            handleSave={handleSaveObjective}
            title="Objective"
          >
            <MultilineTextFields
              label="Objective"
              value={objectiveField}
              onChange={(e) => setObjectiveField(e.target.value)}
            />
          </PopUpModal>
        </h3>
        <p className="contentbox">{objectiveField}</p>
      </div>
    </>
  );
};

export default TalProfileObj;
