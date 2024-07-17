import React, { createContext, useContext, useEffect, useState } from "react";

const UserContext = createContext();
export const UserProvider = ({ children }) => {
  const [userFirstName, setUserFirstName] = useState(
    localStorage.getItem("userFirstName") || ""
  );
  const [userLastName, setUserLastName] = useState(
    localStorage.getItem("userLastName") || ""
  );
  const [userImage, setUserImage] = useState(
    localStorage.getItem("userImage") || ""
  );
  const [userEmail, setUserEmail] = useState(
    localStorage.getItem("userEmail") || ""
  );
  const [userRole, setUserRole] = useState(
    localStorage.getItem("userRole") || ""
  );

  const [companyName, setCompanyName] = useState(
    localStorage.getItem("companyName") || "Default Company Name"
  );

  const [description, setDescription] = useState(
    localStorage.getItem("description") || "Default Company Description"
  );

  //fileInputFile is a state containing the employer's profile image
  const [imgurl, setImageUrl] = useState(
    localStorage.getItem("imgurl") || "/defaultprofileimg.jpg"
  );

  const [missionStatement, setMissionStatement] = useState(
    localStorage.getItem("missionStatement") ||
      "Your company's mission statement."
  );

  const [headquarters, setHeadquarters] = useState(
    localStorage.getItem("headquarters") || "Earth"
  );

  const [phone, setPhone] = useState(
    localStorage.getItem("phone") || "12345678"
  );

  const [userID, setUserID] = useState(localStorage.getItem("userID") || "");

  const handleUserLogout = () => {
    setUserFirstName("");
    setUserLastName("");
    setUserImage("");
    setUserEmail("");
    setUserRole("");
    setUserID("");

    setCompanyName("");
    setHeadquarters("");
    setMissionStatement("");
    setPhone("");

    localStorage.removeItem("userFirstName");
    localStorage.removeItem("userLastName");
    localStorage.removeItem("userImage");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userID");
    localStorage.removeItem("companyName");
    localStorage.removeItem("description");
    localStorage.removeItem("phone");
  };

  useEffect(() => {
    localStorage.setItem("userFirstName", userFirstName);
    localStorage.setItem("userLastName", userLastName);
    localStorage.setItem("userImage", userImage);
    localStorage.setItem("userEmail", userEmail);
    localStorage.setItem("userRole", userRole);
    localStorage.setItem("userID", userID);
    localStorage.setItem("companyName", companyName);
    localStorage.setItem("description", description);
    localStorage.setItem("missionStatement", missionStatement);
    localStorage.setItem("headquarters", headquarters);
    localStorage.setItem("phone", phone);
  }, [
    userFirstName,
    userLastName,
    userImage,
    userEmail,
    userRole,
    userID,
    companyName,
    description,
    missionStatement,
    headquarters,
    phone,
  ]);

  return (
    <UserContext.Provider
      value={{
        userFirstName,
        setUserFirstName,
        userLastName,
        setUserLastName,
        userImage,
        setUserImage,
        userEmail,
        setUserEmail,
        userRole,
        setUserRole,
        userID,
        setUserID,
        companyName,
        setCompanyName,
        description,
        setDescription,
        imgurl,
        setImageUrl,
        missionStatement,
        setMissionStatement,
        headquarters,
        setHeadquarters,
        phone,
        setPhone,
        handleUserLogout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to consume the UserContext
export const useUser = () => useContext(UserContext);

//when user log in, use localstorage to store the users' main data. once's user log out, clear local storage, in case another user is using the same computer.
