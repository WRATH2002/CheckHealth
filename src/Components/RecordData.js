import React, { useState, useEffect } from "react";
import { FaArrowRightLong } from "react-icons/fa6";

import { MdSpaceDashboard } from "react-icons/md";
import { MdOutlineSpaceDashboard } from "react-icons/md";

import { RiHome3Line } from "react-icons/ri";
import { RiHome3Fill } from "react-icons/ri";

import { HiOutlineBellAlert } from "react-icons/hi2";
import { HiMiniBellAlert } from "react-icons/hi2";

import { VscAccount } from "react-icons/vsc";
import { Link } from "react-router-dom";
// import { auth, db, st } from "../firebase";

import firebase from "../firebase";
import { onSnapshot } from "firebase/firestore";

import { CgSmartphoneShake } from "react-icons/cg";
import { IoWatchOutline } from "react-icons/io5";
import { FaPersonFalling } from "react-icons/fa6";
import { PiHeartbeatFill } from "react-icons/pi";
import { IoWatch } from "react-icons/io5";
import { onAuthStateChanged, signOut } from "firebase/auth";
// import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
const RecordData = () => {
  // const [showAlert, setShowAlert] = useState(true);
  const [alert, setAlert] = useState(false);

  const [status, setStatus] = useState(false);
  const [wornStatus, setWornStatus] = useState(true);
  const [lastBpm, setLastBpm] = useState("");
  const [loading, setLoading] = useState(true);
  const [dataSize, setDataSize] = useState(0);
  const [prevDataSize, setPrevDataSize] = useState(0);
  const [lastUpdated, setLastUpdated] = useState(Date.now());
  const [flag, setFlag] = useState(0);
  const [account, setAccount] = useState(false);
  const [countDown, setCountDown] = useState(30);
  // const recordData = [];
  let recordData;

  useEffect(() => {
    setLastUpdated(Date.now());
    console.log("time changeddddd");
    console.log(Date.now());
  }, [recordData]);

  useEffect(() => {
    // Creating a timeout within the useEffect hook
    if (alert === true) {
      if (countDown === 0) {
        ignoreFallState();
      } else {
        setTimeout(() => {
          // setData("Welcome to gfg!");
          // setIsLoading(false);
          // let temp = alert;
          setCountDown(countDown - 1);
        }, 1000);
      }
    }
  }, [alert, countDown]);

  useEffect(() => {
    const interval = setInterval(() => {
      const timeElapsed = Date.now() - lastUpdated;
      const timeLimit = 5000;
      if (timeElapsed > timeLimit) {
        setWornStatus(false);
      } else {
        setWornStatus(true);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [lastUpdated]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  function fetchFallState() {
    const user1 = firebase.auth().currentUser;
    const StateRef = db.collection("USERS").doc(user1?.uid);
    onSnapshot(StateRef, (snapshot) => {
      setStatus(snapshot.data()?.state);
      recordData = snapshot.data()?.Data;
      setLastBpm(recordData[recordData?.length - 1]?.Bpm);
      setLastUpdated(Date.now());
    });
  }

  useEffect(() => {
    fetchFallState();
    fetchAlert();
  }, []);

  function fetchAlert() {
    const user = firebase.auth().currentUser;
    const DataRef = db.collection("USERS").doc(user.uid);

    onSnapshot(DataRef, (snapshot) => {
      // console.log(snapshot.data().Data);
      setAlert(snapshot.data().state);
    });
    // console.log(user);
  }

  function ignoreFallState() {
    const user1 = firebase.auth().currentUser;
    const StateRef = db
      .collection("USERS")
      .doc(user1?.uid)
      .update({ state: false });
    setCountDown(30);
  }

  const userSignOut = () => {
    signOut(auth)
      .then(() => console.log("Signed Out Successfully"))
      .catch((error) => console.log(error));
  };
  return (
    <>
      {account === true ? (
        <>
          <div className="w-[150px] h-[120px] rounded-xl bg-[white] fixed bottom-[80px] z-50 right-[20px]">
            <div
              className="flex justify-center items-center rounded-xl w-full h-[40px] z-50"
              onClick={() => {
                userSignOut();
              }}
            >
              Log Out
            </div>
            <Link
              to="/documentation"
              className="flex justify-center items-center rounded-xl w-full h-[40px] z-50"
            >
              Documentation
            </Link>
            {/* <div className="flex justify-center items-center rounded-xl w-full h-[40px] z-50">
              Documentation
            </div> */}
            <Link
              to="/solutions"
              className="flex justify-center items-center rounded-xl w-full h-[40px] z-50"
            >
              Solution
            </Link>
            {/* <div className="flex justify-center items-center rounded-xl w-full h-[40px] z-50">
              Solution
            </div> */}
          </div>
        </>
      ) : (
        <></>
      )}
      <div className="w-full h-[100svh] fixed bg-[black] flex justify-start items-start">
        <div className="w-[500px] h-[500px] fixed left-[-200px] top-[-200px] bg-[#5fcff5] rounded-full"></div>
        <div className="w-[300px] h-[300px] fixed bottom-[110px] right-[-110px] bg-[#976cf7] rounded-full"></div>
      </div>
      <div className="w-full h-[100svh] flex justify-center items-center bg-[#031e17]   backdrop-blur-3xl">
        {alert === true ? (
          <div
            className="w-full h-[100svh]  fixed z-20 flex flex-col justify-center items-center drop-shadow-lg"
            // style={{ transition: ".4s" }}
          >
            <div
              className="w-[90%] md:w-[60%] lg:w-[60%] h-[80%] flex flex-col justify-center items-center opacity-100"
              // style={{ transition: ".2s", transitionDelay: ".6s" }}
            >
              <div className="w-full  font-bold text-[40px] text-[#ffa947] font-[google]  mt-[5px] flex flex-col justify-center items-center">
                Fall Detected !
              </div>
              <div className="w-full text-white h-[60px] flex justify-center items-center text-center mt-[50px] font-[google]  text-[15px] px-[20px]">
                Sending alert to Emergency Contact: Ambulance in 30 seconds.
                PLease stay calm and wait for help. If you think this is not for
                concern, then click on Cancel Alert.
              </div>
              <div className="w-[100%]  h-[80px] flex justify-between items-center text-center font-[google] mt-[40px] text-[15px] px-[20px]">
                <div className="w-[29%] h-full rounded-lg  bg-[#162d27] text-white font-normal text-[35px] flex justify-center items-center">
                  00
                </div>
                {/* <span className="font-bold text-[25px]">:</span> */}
                <div className="w-[29%] h-full rounded-lg bg-[#162d27] text-white font-normal text-[35px] flex justify-center items-center">
                  00
                </div>
                {/* <span className="font-bold text-[25px]">:</span> */}
                <div className="w-[29%] h-full rounded-lg bg-[#162d27] text-white font-normal text-[35px] flex justify-center items-center">
                  {countDown < 10 ? <>0{countDown}</> : <>{countDown}</>}
                </div>
              </div>
              <div className="w-full h-[50px] flex justify-center items-center mt-[50px] px-[20px]">
                <button
                  className="w-full h-full outline-none flex justify-center items-center font-[google] font-medium tracking-wide text-[17px] rounded-lg text-black bg-[#deeed8] hover:bg-[#162d27] hover:text-white drop-shadow-sm"
                  style={{ transition: ".3s" }}
                >
                  Emergency Contact
                </button>
              </div>
              <div className="w-full h-[50px] flex justify-center items-center mt-[15px] px-[20px]">
                <button
                  className="w-full h-full outline-none flex justify-center items-center font-[google] font-medium text-[17px] rounded-lg text-[white] bg-[#162d27] drop-shadow-sm"
                  style={{ transition: ".3s" }}
                  onClick={() => {
                    ignoreFallState();
                  }}
                >
                  Cancel Alert
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full md:w-[60%] lg:w-[60%] h-[100svh]  flex flex-col justify-center items-center">
            <div className="h-[80px] w-full flex justify-center text-white items-center font-[google] font-normal text-[28px] tracking-wider">
              Health Monitor
            </div>

            <div className="w-full h-[calc(100%-80px)] ">
              <div className="w-full h-[200px] flex flex-row justify-between items-center px-[20px]">
                {wornStatus === true ? (
                  <div className="w-[47%] h-full bg-[#162d27] p-[20px] md:p-[40px] lg:p-[40px]  rounded-2xl font-[google] text-[#ffffff] flex flex-col justify-end items-end  drop-shadow-sm">
                    <div className="w-full h-[25px] font-normal text-[#b7b7b7]  text-[17px]">
                      <IoWatch className="text-white text-[25px]" />
                    </div>
                    <div className="w-full h-[25px] font-normal text-[#b7b7b7] mt-[20px] text-[17px]">
                      Device Worn
                    </div>
                    {wornStatus === false ? (
                      <div className="w-full h-[141px] font-normal text-[25px] mt-[5px] text-[#ffa947]">
                        Device not Worn
                      </div>
                    ) : loading === true ? (
                      <div className="w-full h-[141px] font-normal text-[25px] mt-[5px] text-[#ffffff]">
                        Calibrating Device ...
                      </div>
                    ) : (
                      <div className="w-full h-[141px] font-normal text-[25px] mt-[5px] text-[#7cd74c]">
                        Device Worn
                      </div>
                    )}
                    {/* <div className="w-full h-[175px] font-bold text-[25px] mt-[5px] text-[#b52f2f]">
                Device not Worned
              </div> */}
                    {/* <div className="w-[40px] h-[30px] rounded-xl bg-[white] fixed flex justify-center items-center  drop-shadow-sm">
              <FaArrowRightLong />
            </div> */}
                  </div>
                ) : (
                  <div className="w-[47%] h-full bg-[#630000b0]  p-[20px] md:p-[40px] lg:p-[40px]  rounded-2xl font-[google] text-[#ffffff] flex flex-col justify-end items-end  drop-shadow-sm">
                    <div className="w-full h-[25px] font-normal text-[#b7b7b7]  text-[17px]">
                      <IoWatch className="text-white text-[25px]" />
                    </div>
                    <div className="w-full h-[25px] font-normal text-[#b7b7b7] mt-[20px] text-[17px]">
                      Device Worn
                    </div>
                    {wornStatus === false ? (
                      <div className="w-full h-[141px] font-normal text-[25px] mt-[5px] text-[#ffa947]">
                        Device not Worn
                      </div>
                    ) : loading === true ? (
                      <div className="w-full h-[141px] font-normal text-[25px] mt-[5px] text-[#ffffff]">
                        Calibrating Device ...
                      </div>
                    ) : (
                      <div className="w-full h-[141px] font-normal text-[25px] mt-[5px] text-[#7cd74c]">
                        Device Worn
                      </div>
                    )}
                    {/* <div className="w-full h-[175px] font-bold text-[25px] mt-[5px] text-[#b52f2f]">
                Device not Worned
              </div> */}
                    {/* <div className="w-[40px] h-[30px] rounded-xl bg-[white] fixed flex justify-center items-center  drop-shadow-sm">
              <FaArrowRightLong />
            </div> */}
                  </div>
                )}
                <div className="w-[47%] h-full bg-[#162d27] p-[20px] md:p-[40px] lg:p-[40px]  rounded-2xl font-[google] text-[#ffffff] flex flex-col justify-end items-end  drop-shadow-sm">
                  <div className="w-full h-[25px] font-normal text-[#b7b7b7]  text-[17px]">
                    <FaPersonFalling className="text-white text-[25px]" />
                  </div>
                  <div className="w-full h-[25px] font-normal text-[#b7b7b7] mt-[20px] text-[17px] ">
                    Fall Detection
                  </div>
                  <div className="w-full h-[141px] font-normal text-[25px] mt-[5px] text-[#7cd74c]">
                    Not Triggered
                  </div>
                  {/* <div className="w-[40px] h-[30px] rounded-xl bg-[white] fixed flex justify-center items-center drop-shadow-sm">
              <FaArrowRightLong />
            </div> */}
                </div>
              </div>

              <div className="w-full h-[200px] flex flex-row justify-between items-center mt-[20px] px-[20px]">
                <div className="w-[47%] h-full bg-[#162d27] p-[20px] md:p-[40px] lg:p-[40px]  rounded-2xl font-[google] text-[#ffffff] flex flex-col justify-end items-end  drop-shadow-sm">
                  <div className="w-full h-[25px] font-normal text-[#b7b7b7]  text-[17px]">
                    <PiHeartbeatFill className="text-white text-[25px]" />
                  </div>

                  <div className="w-full h-[25px] font-normal text-[#b7b7b7] mt-[20px]  text-[17px]">
                    Current BPM
                  </div>
                  <div className="w-full h-[141px] font-normal text-[25px] mt-[5px]">
                    {wornStatus === false ? <>--</> : <>{lastBpm} bpm</>}
                  </div>

                  <div className="w-[40px] h-[30px] rounded-xl bg-[#42b502] fixed flex justify-center items-center  drop-shadow-sm">
                    <Link
                      to="/dashboard"
                      className="w-full h-full flex justify-center items-center"
                    >
                      <FaArrowRightLong className="text-white" />
                    </Link>
                  </div>
                </div>
              </div>

              <div className="w-full h-[40px] flex justify-start items-center font-[google] font-bold text-[20px] text-white my-[15px] px-[20px]">
                Alerts
              </div>

              {/* <div className="w-full h-[40px] flex justify-center items-center font-[google]  text-[18px] px-[20px]">
          No Alerts
        </div> */}
              <div className="w-full h-[40px] flex justify-center items-center text-center font-[google] text-[#b6b6b6]  text-[15px] px-[60px]">
                No Alerts have been triggered today. Your safety is our
                priority.
              </div>

              <div className="w-full h-[50px] flex justify-center items-center my-[25px] px-[20px]">
                <button
                  className="w-[60%] md:w-[40%] lg:w-[40%] h-full outline-none flex justify-center items-center font-[google] text-[17px] tracking-wide  rounded-xl text-black bg-[#deeed8] hover:bg-[#162d27] hover:text-white  drop-shadow-sm"
                  style={{ transition: ".3s" }}
                >
                  Emergency Contact
                </button>
              </div>
            </div>
            <div className="w-full h-[70px] fixed bottom-0 flex justify-center items-center bg-[#031e17] text-[#d2d2d2] text-[15px]">
              <div className="w-full md:w-[60%] lg:w-[60%] h-full flex justify-between items-center ">
                <div className="w-[30%] h-[50px] flex flex-col justify-center items-center ">
                  <Link
                    to="/"
                    className="w-full h-full flex justify-center items-center flex-col"
                  >
                    <RiHome3Line className="text-[23px] my-[2px]" />
                    Home
                  </Link>
                </div>
                <div className="w-[30%] h-[50px] flex flex-col justify-center text-[#deeed8] items-center ">
                  <Link
                    to="/alert"
                    className="w-full h-full flex justify-center items-center flex-col"
                  >
                    <HiMiniBellAlert className="text-[23px]  my-[2px]" />
                    Alerts
                  </Link>
                </div>
                <div className="w-[30%] h-[50px] flex flex-col justify-center items-center ">
                  <Link
                    to="/dashboard"
                    className="w-full h-full flex justify-center items-center flex-col"
                  >
                    <MdOutlineSpaceDashboard className="text-[23px] my-[2px]" />
                    Dashboard
                  </Link>
                </div>
                <div
                  className="w-[30%] h-[50px] flex flex-col justify-center items-center "
                  onClick={() => {
                    setAccount(!account);
                  }}
                >
                  {/* <Link className="w-full h-full"> */}
                  <VscAccount className="text-[23px] my-[2px]" />
                  Account
                  {/* </Link> */}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default RecordData;
