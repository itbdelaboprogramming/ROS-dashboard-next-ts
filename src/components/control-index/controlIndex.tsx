import { MouseEvent, useEffect, useRef, useState } from "react";
import ConfirmElement from "@/components/confirm-element/confirmElement";
import Navigation from "../unit-navigation/navigation";
import styles from "./controlIndex.module.css";
import CloseButton from "@/components/close-button/closeButton";
import Footer from "@/components/footer/footer";
import MapSaving from "@/components/map-saving/mapSaving";
import ConfirmSaving from "@/components/confirm-saving-mapping/confirmSaving";
import axios from "axios";
import mqtt from "mqtt";

var ros: any
var viewer: any
var paN: any
var movecoor: any = [];
var isDrag = false;
var startcoor: any = [];
var showImage:boolean = false;
var gridClient:any;
var multiPointMode = false;
var singlePointMode = false;
var getInit = false;
var setHomeBaseMode = false;
var homePoint:any = null;

export default function Mapping() {
  const [showConfirmClosePageDialog, setShowConfirmClosePageDialog] =
    useState<boolean>(false);
  const [showConfirmMappingDialog, setShowConfirmMappingDialog] =
    useState<boolean>(false);
  const [savingConfirmDialog, setSavingConfirmDialog] = useState<boolean>(false);
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [status, setStatus] = useState<string>("Idle");
  const [backendUrl, setBackendUrl] = useState<string>(process.env.BACKEND_URL || "http://localhost:5000");
  const [brokerUrl, setBrokerUrl] = useState<string>(process.env.WS_MQTT_BROKER_URL || "ws://localhost:9001");
  const [rosUrl, setRosUrl] = useState<string>(process.env.WS_ROSBRIDGE_URL || "ws://localhost:9090");
  const [topic, setTopic] = useState<string>('/camera');
  const [imageBlob, setImageBlob] = useState<Blob | null>(null);
  const [mapName, setMapName] = useState<string>('');
  const [showOptions, setShowOptions] = useState(false);
  const [isRotated, setIsRotated] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string>("");



  const onConfirmButtonClick = () => {
    setShowConfirmClosePageDialog(true);
  };

  const onConfirmMappingButtonClick = () => {
    setShowConfirmMappingDialog(true);
  };

  const handleCancel = () => {
    setShowConfirmClosePageDialog(false);
  };

  const handleDatabaseCancel = () => {
    setShowConfirmMappingDialog(false);
  };

  const changeStatus = (newStatus: string) => {
    isChecked === true ? setStatus(newStatus) : setStatus("Idle");
  };

  const onConfirmSaveMappingButtonClick = () => {
    setSavingConfirmDialog(true);
  };

  const setLidar = (enable: boolean, use_own_map: boolean): void => {
    axios.post(`${backendUrl}/api/lidar`, {
      enable: enable,
      use_own_map: use_own_map
    }, {
      headers: {
        'Authorization': `Bearer ${sessionStorage.getItem('token')}`
      }
    })
      .then(function (response: any) {
        console.log(response);
      })
      .catch(function (error: any) {
        console.log(error);
      });
    showImage = enable
  }

  const setRobot = (start: boolean, pause: boolean, stop: boolean): void => {
    /*for now the logic is the same as pause because sending stop
      because sending stop will save the map to the robot
      also, the API should be a path planning API not exploration
      mapping API.*/
    axios.post(`${backendUrl}/api/mapping`, {
      start: start,
      pause: pause,
      stop: stop
    }, {
      headers: {
        'Authorization': `Bearer ${sessionStorage.getItem('token')}`
      }
    })
      .then(function (response: any) {
        console.log(response);
        if (start) {
          changeStatus("On Progress");
        }
        else if (pause) {
          changeStatus("Paused");
        }
        else if (stop) {
          changeStatus("Idle");
          alert("Map saved successfully");
        }
      })
      .catch(function (error: any) {
        console.log(error);
      });
  }

  const setOwnMap = (enable: boolean, map_name: string): void => {
    axios.post(`${backendUrl}/api/set_own_map`, {
      enable: enable,
      map_name: map_name
    }, {
      headers: {
        'Authorization': `Bearer ${sessionStorage.getItem('token')}`
      }
    })
      .then(function (response: any) {
        console.log(response);
      })
      .catch(function (error: any) {
        console.log(error);
      });
  }

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Update the state with the new checkbox value
    setIsChecked(event.target.checked);
    // isChecked === false ? changeStatus("Idle") : "";
    if (event.target.checked) {
      setOwnMap(true, sessionStorage.getItem("mapName") || '');
      setLidar(true, true);
    } else {
      setOwnMap(false, '');
      setLidar(false, false);
    }
  };

  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Connect to ROS.
    const ROSLIB = (window as any).ROSLIB;
    ros = new ROSLIB.Ros({
      url: rosUrl,
    });

    // Handle ROS connection errors
    ros.on('error', (error: Error) => {
      console.error('Error connecting to ROS:', error);
    });

    // Handle ROS connection closure
    ros.on('close', () => {
      console.log('Connection to ROS is closed.');
    });

    // Create the main viewer.
    viewer = new (window as any).ROS2D.Viewer({
      divID: 'map',
      width: mapRef.current?.clientWidth || 1870,
      height: mapRef.current?.clientHeight || 958,
      background: "#7F7F7F",
    });

    paN = new (window as any).ROS2D.PanView({
      rootObject: viewer.scene,
    });

    // Setup the map client.
    gridClient = new (window as any).NAV2D.OccupancyGridClientNav({
      ros: ros,
      rootObject: viewer.scene,
      viewer: viewer,
      withOrientation: true,
      withCommand: true,
      continuous: true
    });

    var zoomView = new (window as any).ROS2D.ZoomView({
      rootObject: viewer.scene
    });


    // Setup the map client if ROS is connected
    ros.on('connection', () => {
      console.log('Connected to ROS websocket server.');
    });

    // MQTT Client Setup
    const mqtt_client = mqtt.connect(brokerUrl);
    mqtt_client.on('connect', () => {
      mqtt_client.subscribe(topic);
      console.log('Connected to MQTT broker');
    });

    mqtt_client.on('message', (receivedTopic, message) => {
      if (receivedTopic === topic) {
        const receivedImageBlob = new Blob([message]);
        setImageBlob(showImage ? receivedImageBlob : null);
      }
    });

    mqtt_client.on('close', () => {
      console.log('Connection to MQTT is closed');
    })

    const mapNameFromSession = sessionStorage.getItem('mapName');
    setMapName(mapNameFromSession ?? ''); // If mapNameFromSession is null, use an empty string

    return () => {
      //clean up when exiting page
      ros.close();
      setOwnMap(false, '');
      setLidar(false, false);
    }
  }, []);



  var zoomCrossConst: number[] = []
  var firstZoomVar = 1

  const zoomIn = () => {
    var zoom = new (window as any).ROS2D.ZoomView({
      ros: ros,
      rootObject: viewer.scene,
    });
    zoom.startZoom(250, 250);
    const zoomInConst = 1.2
    firstZoomVar = firstZoomVar * zoomInConst;
    zoom.zoom(zoomInConst);
    zoomCrossConst.push(zoomInConst)
  }

  const zoomOut = () => {
    var zoom = new (window as any).ROS2D.ZoomView({
      ros: ros,
      rootObject: viewer.scene,
    });
    zoom.startZoom(250, 250);
    const zoomOutConst = 0.8
    firstZoomVar = firstZoomVar * zoomOutConst
    zoom.zoom(zoomOutConst);
    zoomCrossConst.push(zoomOutConst)
  }

  const restart = () => {
    var zoom = new (window as any).ROS2D.ZoomView({
      ros: ros,
      rootObject: viewer.scene,
    });
    var rotate = new (window as any).ROS2D.Rotate({
      rootObject: viewer.scene
    });
    rotate.resetRotate();
    zoom.startZoom(250, 250);
    var result = zoomCrossConst.reduce((accumulator, currentValue) => accumulator * currentValue, 1);
    var newConst = 1 / result;
    zoom.zoom(newConst)
    zoomCrossConst = []
  }

  const whenMouseDown = (event: MouseEvent) => {
    if (event.button === 1) {
      // middle click
      paN.startPan(event.clientX, event.clientY);
      isDrag = true;
      startcoor[0] = event.clientX;
      startcoor[1] = event.clientY;
    }
  }

  const rotateCW = () => {
    var rotate = new (window as any).ROS2D.Rotate({
      rootObject: viewer.scene
    });
    rotate.startRotate(20);
  }

  const whenMouseUp = (event: MouseEvent) => {
    isDrag = false;
  }

  const whenMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (isDrag) {
      // Perform the action when the mouse is clicked and moving
      paN.pan(e.clientX, e.clientY);
    }
  };

    //multi pin point feature
  //change to between single and multi pin point mode
  const multiPoint = () => {
    if (multiPointMode == false) {
      multiPointMode = true;
      gridClient.navigator.multiPointMode(true);
      var button = document.getElementById("multiModeButton")
      if(button != null){
        button.innerText = "Finish Pin Point Mode"
        console.log("button changes")
      }
    }

    else if (multiPointMode == true) {
      multiPointMode = false
      gridClient.navigator.multiPointMode(false);
      var button = document.getElementById("multiModeButton")
      if(button != null){
        button.innerText = "Multi Pin Point Mode"
        console.log("button changes")
      }
    }
  }

  const singlePoint = () => {
    if (singlePointMode == false) {
      singlePointMode = true;
      gridClient.navigator.singlePointMode(true);
      var button = document.getElementById("singleModeButton")
      if(button != null){
        button.innerText = "Finish Pin Point Mode"
        console.log("button changes")
      }
    }

    else if (singlePointMode == true) {
      singlePointMode = false
      gridClient.navigator.singlePointMode(false);
      var button = document.getElementById("singleModeButton")
      if(button != null){
        button.innerText = "Single Pin Point Mode"
        console.log("button changes")
      }
    }
  }
  //start navigation after multi pin point arranged
  const startNavigation = () => {
    gridClient.navigator.startNaav();
  }

  //pause navigation
  const pauseNavigation = () => {
    gridClient.navigator.pauseNav();
  }

  //remove all marker
  const removeallMarker = () => {
    gridClient.navigator.removeAllMark();
  }

  //2D pose estimation
  const initPose = () => {
    if (getInit == false) {
      getInit = true;
      gridClient.navigator.initPose(true);
      var button = document.getElementById("initButton")
      if(button != null){
        button.innerText = "Done Initial Pose"
        console.log("button changes")
      }
      console.log("initial pose")
    }

    else if (getInit == true) {
      getInit = false
      gridClient.navigator.initPose(false);
      var button = document.getElementById("initButton")
      if(button != null){
        button.innerText = "Initial Pose"
        console.log("button changes")
      }
      console.log("initial pose done")
    }
  }

  //home base feature
  //change user input mode to modify home base point by input
  const setHomeBase = () => {
    if (setHomeBaseMode == false) {
      setHomeBaseMode = true;
      gridClient.navigator.setHomeBasePoint(true);
      var button = document.getElementById("setHomebtn")
      if(button != null){
        button.innerText = "Done Set Home Base"
        console.log("button changes")
      }
    }
    else if (setHomeBaseMode == true) {
      setHomeBaseMode = false;
      gridClient.navigator.setHomeBasePoint(false);
      getHomeBasePoint();
      var button = document.getElementById("setHomebtn")
      if(button != null){
        button.innerText = "Set Home Base"
        console.log("button changes")
      }
    }

  }
  //get home base point from SLAM initial point
  const getHomeBasePoint = () => {
    if (gridClient.navigator != null) {
      homePoint = gridClient.navigator.getHomeBasePoint();
      console.log(homePoint);
    }

  }
  //update home base and initial pose estimate when control page launched
  const updateHomeBase = () => {
    if (homePoint != null) {
      if (gridClient.navigator != null) {
        gridClient.navigator.updateHome(homePoint);
      }
    }
  }
  //command robot to return to home point
  const returnToHome = () => {
    if (homePoint != null) {
      gridClient.navigator.returnToHome(homePoint);
    }
  }


  const toggleOptions = () => {
    setShowOptions(!showOptions);
    setIsRotated(!isRotated);
  };

  const selectedModeListButton = (id: string) => () => {
    if (isRotated) {
      id == selectedOption ? setSelectedOption("") : ""
      selectedOption == "" ? setSelectedOption(id) : ""
    }
  };


  return (
    <>
      {" "}

      <ConfirmElement
        message="Are you sure you want to close this app?"
        status={showConfirmClosePageDialog}
        onCancel={handleCancel}
      />
      <ConfirmSaving
        message="Are you sure you want to stop and save the map?"
        status={showConfirmMappingDialog}
        onCancel={handleDatabaseCancel}
        onConfirm={onConfirmSaveMappingButtonClick}
      />
      <MapSaving status={savingConfirmDialog} />
      <div className={styles.container}>
        <div className={styles.parents}>
          <div className={styles.statusSection}>
            <div
              className={`${styles.status} ${status === "Idle" ? styles.idle : ""
                }`}
            >
              <img src="/icons/information-circle-svgrepo-com.svg" alt="" />
              <p>
                Status : <span>{status}</span>
              </p>
            </div>
            <div className={styles.lidar}>
              <p>LIDAR</p>
            </div>
            <div className={styles.lidarButton}>
              <label className={styles.toggleSwitch}>
                <input
                  type="checkbox"
                  className={styles.toggleInput}
                  checked={isChecked}
                  onChange={handleCheckboxChange}
                />
                <span className={styles.slider}></span>
              </label>
            </div>
          </div>
          <CloseButton onClick={onConfirmButtonClick} />
          <div className={styles.navigation}>
            <Navigation imageSrc={imageBlob ? URL.createObjectURL(imageBlob) : undefined} />
          </div>
          <div className={styles.mapSection}>
            <div className={styles.topDiv}>
              <p>Run the Prototype</p>
              <div
                className={`${styles.playButton} ${status === "On Progress" ? styles.buttonActive : ""
                  }`}
                onClick={() => {
                  if (isChecked) {
                    setRobot(true, false, false);
                    console.log("Play request sent");
                  }
                  else {
                    alert("Please turn on LIDAR first.")
                  }
                  startNavigation();
                }}
              >
                <p>Play</p>
                <img src="/icons/3.svg" alt="" />
              </div>
              <div
                className={`${styles.pauseButton} ${status === "Paused" ? styles.buttonActive : ""
                  }`}
                onClick={(() => {
                  if (isChecked) {
                    setRobot(false, true, false);
                    console.log("Pause request sent");
                  } else {
                    alert("Please turn on LIDAR first.")
                  }
                  pauseNavigation();
                })}
              >
                <p>Pause</p>
                <img src="/icons/1.svg" alt="" />
              </div>
              <div
                className={styles.stopButton}
                onClick={() => {
                  if (isChecked) {
                    setRobot(false, true, false);
                    console.log("Stop request sent");
                  } else {
                    alert("Please turn on LIDAR first.")
                  }
                  returnToHome();
                }}
              >
                <p>Return Home</p>
                <img src="/icons/Home.svg" alt="" />
              </div>
            </div>
            <div className={styles.centerDiv} id="map" onMouseMove={whenMouseMove} onMouseDown={whenMouseDown} onMouseUp={whenMouseUp}>

              <div className={styles.navigationSection}>

                <div className={styles.mapPreview}>
                  <div className={styles.map}>
                    <img src="/images/map.png" alt="" />
                  </div>
                </div>

                <div className={styles.modeListSection}>
                  <div
                    className={`${styles.modeListParents} ${styles.modeListOption}`}
                    onClick={toggleOptions}
                  >
                    <p>Mode List</p>
                    <img
                      src="/icons/down-arrow.svg"
                      alt=""
                      className={`${styles.modeList} ${isRotated ? styles.rotated : ''}`}
                    />
                  </div>

                  <div id="mode-list-1" className={`${showOptions || selectedOption == "mode-list-1" ? "" : styles.displayNone} ${styles.modeListParents} ${styles.option} ${selectedOption != "" ? styles.disableModeListButton : ""} ${selectedOption != "" && selectedOption == "mode-list-1" ? styles.activeDisableModeListButton : ""}`} onClick={() => {selectedModeListButton("mode-list-1"); singlePoint();}}>
                    <img src="/icons/Marker.svg" alt="" />
                    {selectedOption == "mode-list-1" ? <p>Finish Pinpoint</p> : <p>Single Pinpoint</p>}
                  </div>
                  <div id="mode-list-2" className={`${showOptions || selectedOption == "mode-list-2" ? "" : styles.displayNone} ${styles.modeListParents} ${styles.option} ${selectedOption != "" ? styles.disableModeListButton : ""} ${selectedOption != "" && selectedOption == "mode-list-2" ? styles.activeDisableModeListButton : ""}`} onClick={() =>{selectedModeListButton("mode-list-2"); multiPoint();}}>
                    <img src="/icons/Marker.svg" alt="" />
                    {selectedOption == "mode-list-2" ? <p>Finish Pinpoint</p> : <p>Multiple Pinpoint</p>}
                  </div>
                  <div id="mode-list-3" className={`${showOptions || selectedOption == "mode-list-3" ? "" : styles.displayNone} ${styles.modeListParents} ${styles.option} ${selectedOption != "" ? styles.disableModeListButton : ""} ${selectedOption != "" && selectedOption == "mode-list-3" ? styles.activeDisableModeListButton : ""}`} onClick={() => {selectedModeListButton("mode-list-3"); setHomeBase();}}>
                    <img src="/icons/Home.svg" alt="" />
                    {selectedOption == "mode-list-3" ? <p>Finish Home Base</p> : <p>Set Home Base</p>}
                  </div>
                  <div id="mode-list-4" className={`${showOptions || selectedOption == "mode-list-4" ? "" : styles.displayNone} ${styles.modeListParents} ${styles.option} ${selectedOption != "" ? styles.disableModeListButton : ""} ${selectedOption != "" && selectedOption == "mode-list-4" ? styles.activeDisableModeListButton : ""}`} onClick={() => {selectedModeListButton("mode-list-4"); initPose();}}>
                    <img src="/icons/Position.svg" alt="" />
                    {selectedOption == "mode-list-4" ? <p>Finish Initial Pose</p> : <p>Initial Pose</p>}
                  </div>
                  <div id="mode-list-5" className={`${showOptions || selectedOption == "mode-list-1" || selectedOption == "mode-list-2" ? "" : styles.displayNone} ${styles.modeListParents} ${styles.deleteOption} ${selectedOption !== "mode-list-1" && selectedOption !== "mode-list-2" ? styles.disableModeListButton : ""}`} onClick={removeallMarker}>
                    <img src="/icons/delete_mode_list.svg" alt="" />
                    <p>Delete All Pinpoints</p>
                  </div>

                </div>

                <div className={styles.buttonNavigation}>
                  <div className={styles.zoomIn} onClick={zoomIn}>
                    <img src="/icons/zoomin.svg" alt="" />
                  </div>
                  <div className={styles.zoomOut} onClick={zoomOut}>
                    <img src="/icons/zoomout.svg" alt="" />
                  </div>
                  <div className={styles.restart} onClick={restart}>
                    <img src="/icons/Maximize.svg" alt="" />
                  </div>
                  <div className={styles.restart} onClick={rotateCW}>
                    <img src="/icons/new reload.svg" alt="" />
                  </div>
                </div>


              </div>

              <div className={styles.footerMap}>
                <div className={styles.emergencyButton}>
                  <img src="/icons/emergency.svg" alt="" />
                  <p>Emergency Button</p>
                </div>
                <div className={styles.mapName}>{mapName}</div>
              </div>
            </div>
          </div>
          <Footer status={false} />
        </div>
      </div>
    </>
  );
}
