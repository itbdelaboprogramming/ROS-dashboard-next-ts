import React, { useEffect, useState } from 'react';
import ConfirmElement from '@/components/confirm-element/confirmElement';
import Navigation from '@/components/unit-navigation/navigation';
import styles from './database.module.css';
import CloseButton from '@/components/close-button/closeButton';
import Footer from '@/components/footer/footer';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import ConfirmDelete from '@/components/confirm-delete/confirmDelete';
import axios from 'axios';
import Head from 'next/head';
import ButtonInformation from '@/components/unit-information-button/unitInformationButton';
import ControlInstruction from '@/components/control-instruction/controlInstruction';
import TokenExpired from '@/components/token-expired/tokenExpired';
import MobileTopSection from '@/components/mobile-top-section/mobileTopSection';
import MobileNavigation from '@/components/mobile-navigation/mobileNavigation';
import MobileInstruction from '@/components/mobile-instruction/mobileInstruction';
import GreetingsUnit from '@/components/greetings-unit/greetingsUnit';
import MobileBottomSection from '@/components/mobile-bottom-section/mobileBottomSection';
import MobileLidarSection from '@/components/mobile-lidar-section/mobileLidarSection';
import { ReduxProvider } from '@/app/reduxProvider';
import { useSelector, useDispatch } from 'react-redux';
import { changeStatus, setStatus } from '@/store/stateMapSelected'; // Adjust import path as needed
import { RootState } from '@/store/types';

interface DataItem {
    mapId: any;
    map_name: string;
    modified_time: string;
    file_type: string;
    file_size: string;
}

export default function Database(): JSX.Element {
    const router = useRouter();

    const initialCheckedIndex =
        typeof window !== 'undefined' ? sessionStorage.getItem('mapIndex') : '-1';
    const parsedInitialIndex = initialCheckedIndex !== null ? parseInt(initialCheckedIndex, 10) : null;
    const [checkedIndex, setCheckedIndex] = useState<number | null>(parsedInitialIndex);

    let mapIndex: number = -1;

    if (typeof window !== 'undefined' && window.sessionStorage) {
        mapIndex = parseInt(sessionStorage.getItem('mapIndex') || '', 10);
    }

    const [isChecked, setIsChecked] = useState<boolean>(false);
    const [showConfirmDialog, setShowConfirmDialog] = useState<boolean>(false);
    const [data, setData] = useState<DataItem[]>([
        {
            mapId: "1",
            map_name: "20230804_Room A",
            modified_time: "2023/08/04 11:30 AM",
            file_type: "PGM",
            file_size: "120 MB"
        },
        {
            mapId: "2",
            map_name: "20230804_Room B",
            modified_time: "2023/08/04 11:37 AM",
            file_type: "PGM",
            file_size: "120 MB"
        },
        {
            mapId: "3",
            map_name: "20230804_Room C",
            modified_time: "2023/08/04 11:53 AM",
            file_type: "PGM",
            file_size: "120 MB"
        },
        {
            mapId: "4",
            map_name: "20230804_Room D",
            modified_time: "2023/08/04 11:23 AM",
            file_type: "PGM",
            file_size: "120 MB"
        },
        {
            mapId: "5",
            map_name: "20230804_Room E",
            modified_time: "2023/08/04 11:35 AM",
            file_type: "PGM",
            file_size: "120 MB"
        },
        {
            mapId: "6",
            map_name: "20230804_Room F",
            modified_time: "2023/08/04 11:35 AM",
            file_type: "PGM",
            file_size: "120 MB"
        },
        {
            mapId: "7",
            map_name: "20230804_Room G",
            modified_time: "2023/08/04 11:35 AM",
            file_type: "PGM",
            file_size: "120 MB"
        },
        {
            mapId: "8",
            map_name: "20230804_Room H",
            modified_time: "2023/08/04 11:35 AM",
            file_type: "PGM",
            file_size: "120 MB"
        },
        {
            mapId: "9",
            map_name: "20230804_Room I",
            modified_time: "2023/08/04 11:35 AM",
            file_type: "PGM",
            file_size: "120 MB"
        },
        {
            mapId: "10",
            map_name: "20230804_Room J",
            modified_time: "2023/08/04 11:35 AM",
            file_type: "PGM",
            file_size: "120 MB"
        },
        {
            mapId: "11",
            map_name: "20230805_Room K",
            modified_time: "2023/08/05 11:30 AM",
            file_type: "PGM",
            file_size: "120 MB"
        },
        {
            mapId: "12",
            map_name: "20230805_Room L",
            modified_time: "2023/08/05 11:37 AM",
            file_type: "PGM",
            file_size: "120 MB"
        },
        {
            mapId: "13",
            map_name: "20230805_Room M",
            modified_time: "2023/08/05 11:53 AM",
            file_type: "PGM",
            file_size: "120 MB"
        },
        {
            mapId: "14",
            map_name: "20230805_Room N",
            modified_time: "2023/08/05 11:23 AM",
            file_type: "PGM",
            file_size: "120 MB"
        },
        {
            mapId: "15",
            map_name: "20230805_Room O",
            modified_time: "2023/08/05 11:35 AM",
            file_type: "PGM",
            file_size: "120 MB"
        },
        {
            mapId: "16",
            map_name: "20230805_Room P",
            modified_time: "2023/08/05 11:35 AM",
            file_type: "PGM",
            file_size: "120 MB"
        },
        {
            mapId: "17",
            map_name: "20230805_Room Q",
            modified_time: "2023/08/05 11:35 AM",
            file_type: "PGM",
            file_size: "120 MB"
        },
        {
            mapId: "18",
            map_name: "20230805_Room R",
            modified_time: "2023/08/05 11:35 AM",
            file_type: "PGM",
            file_size: "120 MB"
        },
        {
            mapId: "19",
            map_name: "20230805_Room S",
            modified_time: "2023/08/05 11:35 AM",
            file_type: "PGM",
            file_size: "120 MB"
        },
        {
            mapId: "20",
            map_name: "20230805_Room T",
            modified_time: "2023/08/05 11:35 AM",
            file_type: "PGM",
            file_size: "120 MB"
        },
        {
            mapId: "21",
            map_name: "20230806_Room U",
            modified_time: "2023/08/06 11:30 AM",
            file_type: "PGM",
            file_size: "120 MB"
        },
        {
            mapId: "22",
            map_name: "20230806_Room V",
            modified_time: "2023/08/06 11:37 AM",
            file_type: "PGM",
            file_size: "120 MB"
        },
        {
            mapId: "23",
            map_name: "20230806_Room W",
            modified_time: "2023/08/06 11:53 AM",
            file_type: "PGM",
            file_size: "120 MB"
        },
        {
            mapId: "24",
            map_name: "20230806_Room X",
            modified_time: "2023/08/06 11:23 AM",
            file_type: "PGM",
            file_size: "120 MB"
        },
        {
            mapId: "25",
            map_name: "20230806_Room Y",
            modified_time: "2023/08/06 11:35 AM",
            file_type: "PGM",
            file_size: "120 MB"
        },
        {
            mapId: "26",
            map_name: "20230806_Room Z",
            modified_time: "2023/08/06 11:35 AM",
            file_type: "PGM",
            file_size: "120 MB"
        },
        {
            mapId: "27",
            map_name: "20230806_Room AA",
            modified_time: "2023/08/06 11:35 AM",
            file_type: "PGM",
            file_size: "120 MB"
        },
        {
            mapId: "28",
            map_name: "20230806_Room AB",
            modified_time: "2023/08/06 11:35 AM",
            file_type: "PGM",
            file_size: "120 MB"
        },
        {
            mapId: "29",
            map_name: "20230806_Room AC",
            modified_time: "2023/08/06 11:35 AM",
            file_type: "PGM",
            file_size: "120 MB"
        },
        {
            mapId: "30",
            map_name: "20230806_Room AD",
            modified_time: "2023/08/06 11:35 AM",
            file_type: "PGM",
            file_size: "120 MB"
        }
    ]);

    const [currentPage, setCurrentPage] = useState<number>(1);
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const [sortOrderStatus, setSortOrderStatus] = useState<String>('name');
    const [sortDateOrder, setDateSortOrder] = useState<'asc' | 'desc'>('asc');
    const [deleteItemConfirm, setDeleteItemConfirm] = useState<boolean>(false);
    const [indexDelete, setIndexDelete] = useState<number>(0);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [backendUrl, setBackendUrl] = useState<string>(process.env.BACKEND_URL || 'http://localhost:5000');
    const [isEditing, setIsEditing] = useState<Record<number, boolean>>({});
    const [render, setRender] = useState<boolean>(true);
    const [firstLoaded, setFirstLoaded] = useState<string>('false')
    const [showControlInstruction, setShowControlInstruction] = useState<boolean>(false);
    const [tokenExpired, setTokenExpired] = useState<boolean>(false);
    const [mobileNavigation, setMobileNavigation] = useState<boolean>(false);
    const [mobileInstruction, setMobileInstruction] = useState<boolean>(false);
    const [mobileSorterDisplay, setMobileSorterDisplay] = useState<boolean>(false);
    const [mobileMapDisplay, setMobileMapDisplay] = useState<boolean>(false);
    const [mobileMapName, setMobileMapName] = useState<string>('');
    const [mobileEditNameDisplay, setMobileEditNameDisplay] = useState<boolean>(false);
    const [newName, setNewName] = useState('');
    const [indexMapChoosed, setIndexMapChoosed] = useState(-1);

    const { value } = useSelector((state: RootState) => state.mapSelected);
    const dispatch = useDispatch();

    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery]);

    useEffect(() => {
        // Initialize state from localStorage
        const mapSelected = localStorage.getItem('mapSelected');
    
        console.log("999999999999 : ", mapSelected);
    
        if (mapSelected !== null) {
            const parsedMapSelected = JSON.parse(mapSelected);
            dispatch(setStatus(parsedMapSelected));
            setCurrentPage(findPageIndex(parsedMapSelected));
        }
    }, [dispatch]);



    const handleMapSelectedChange = (index: string) => {
        dispatch(changeStatus(parseInt(index)));
        // Save state to localStorage
        localStorage.setItem('mapSelected', JSON.stringify(parseInt(index)));
    };



    useEffect(() => {
        function checkToken() {
            // axios.get(`${backendUrl}`, {
            //     headers: {
            //         'Authorization': `Bearer ${sessionStorage.getItem('token') ? sessionStorage.getItem('token') : ''}`
            //     }
            // })
            //     .then((response) => {
            //         if (response.status === 200) {
            //             setRender(true);
            //         } else {
            //             setTokenExpired(true);
            //         }
            //     })
            //     .catch((error) => {
            //         setTokenExpired(true)
            //     });
        }

        function fetchData() {
            axios.get(`${backendUrl}/api/pgm_data`, {
                headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                }
            }).then((response) => {
                const data = response.data.data;
                data.forEach((item: any, index: any) => {
                    // Convert modified_time string to a Date object
                    const originalDate = new Date(item.modified_time);

                    // Format the date
                    const formattedDate = `${originalDate.getFullYear()}/${('0' + (originalDate.getMonth() + 1)).slice(-2)}/${('0' + originalDate.getDate()).slice(-2)} ${('0' + originalDate.getHours()).slice(-2)}:${('0' + originalDate.getMinutes()).slice(-2)}`;

                    // Update the modified_time property with the formatted date
                    item.modified_time = formattedDate;

                    // Add unique id (use uuidv4() if using UUIDs)
                    item.mapId = index; // or uuidv4() if UUIDs
                });

                const sortedData = data.sort((a: any, b: any) => a.map_name.localeCompare(b.map_name));

                setData(sortedData);
                setRender(true);
            }).catch((error) => {

            });
        }

        checkToken();
        fetchData();
        setFirstLoaded(sessionStorage.getItem('firstLoadDatabasePage') === null ? 'true' : 'false');

    }, []);

    const convertTo24HourFormat = (timeString: string) => {
        const [date, time, period] = timeString.split(/[\s:]+/);
        let hours = parseInt(time, 10);

        const minutes = timeString.split(' ')[1].split(':')[1];

        if (period === 'PM' && hours !== 12) {
            hours += 12;
        } else if (period === 'AM' && hours === 12) {
            hours = 0;
        }
        const newTime = `${date} ${hours.toString().padStart(2, '0')}:${minutes}`;

        return newTime
    };

    function sortByDate(data: DataItem[], sortDateOrder: 'asc' | 'desc'): DataItem[] {
        return data.sort((a, b) => {
            const dateA = new Date(a.modified_time);
            const dateB = new Date(b.modified_time);

            if (sortDateOrder === "asc") {
                if (dateA < dateB) {
                    return -1;
                } else if (dateA > dateB) {
                    return 1;
                } else {
                    return 0;
                }
            } else if (sortDateOrder === "desc") {
                if (dateA < dateB) {
                    return 1;
                } else if (dateA > dateB) {
                    return -1;
                } else {
                    return 0;
                }
            }

            return 0;
        });
    }

    // Function to sort data by map_name
    const sortDataByMapName = (data: DataItem[], sortOrder: 'asc' | 'desc'): DataItem[] => {
        const sortedData = [...data];
        sortedData.sort((a, b) => {
            const nameA = a.map_name.toUpperCase();
            const nameB = b.map_name.toUpperCase();
            if (sortOrder === "asc") {
                return nameA.localeCompare(nameB);
            } else {
                return nameB.localeCompare(nameA);
            }
        });
        return sortedData;
    };

    const handleMobileSortClick = (status: any, condition: any) => {
        if (status == "date") {
            setSortOrderStatus('date')
            if (condition.length > 0) {
                setSortOrder(condition)
            } else {
                setSortOrder(sortOrder === "asc" ? "desc" : "asc");
            }
            const sortedDataByDate = sortByDate(data, sortOrder);
            setData(sortedDataByDate);
        } else {
            setSortOrderStatus('name')
            if (condition.length > 0) {
                setSortOrder(condition)
            } else {
                setSortOrder(sortOrder === "asc" ? "desc" : "asc");
            }

            const sortedData = sortDataByMapName(data, sortOrder);
            setData(sortedData);

        }
    };

    const handleSortClick = () => {
        setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        const sortedData = sortDataByMapName(data, sortOrder);
        setData(sortedData);
    };

    const handleDateSortClick = () => {
        setDateSortOrder(sortDateOrder === "asc" ? "desc" : "asc");
        const sortedDataByDate = sortByDate(data, sortDateOrder);
        setData(sortedDataByDate);
    };


    const onConfirmButtonClick = () => {
        setShowConfirmDialog(true);
    };

    const handleCancel = () => {
        setShowConfirmDialog(false);
    };

    const handlePaginationButtonClick = (buttonType: 'first' | 'prev' | 'next' | 'last') => {
        switch (buttonType) {
            case "first":
                setCurrentPage(1);
                break;
            case "prev":
                if (currentPage > 1) {
                    setCurrentPage(currentPage - 1);
                }
                break;
            case "next":
                if (currentPage < totalPages) {
                    setCurrentPage(currentPage + 1);
                }
                break;
            case "last":
                setCurrentPage(totalPages);
                break;
            default:
                break;
        }
    };

    const handleCheckboxChange = (index: string) => {

        if (currentIndex == parseInt(index)) {

        } else {
            dispatch(changeStatus(parseInt(index)));
            handleMapSelectedChange(index)
        }

        // if (startIndex == parseInt(index)) {
        // } else {
        //     if (mapIndex == startIndex + parseInt(index)) {
        //         sessionStorage.setItem("mapIndex", "-1");
        //         setCheckedIndex(-1);
        //     } else {
        //         setCheckedIndex(startIndex + parseInt(index));
        //         sessionStorage.setItem("mapIndex", String(startIndex + parseInt(index)));
        //         sessionStorage.setItem("mapName", data[startIndex + parseInt(index)].map_name)
        //     }
        // }

    };

    const handleLidarChecked = () => { }

    const goToControlWithIndex = () => {
        if (indexMapChoosed !== -1) {
            dispatch(changeStatus(indexMapChoosed));
            // Save state to localStorage
            localStorage.setItem('mapSelected', JSON.stringify(indexMapChoosed));
            router.push(`/unit/control?index=${indexMapChoosed}`);

        }
    };

    //delete Item
    const handleDeleteItem = (index: number) => {
        const dataIdx = startIndex + index;
        setDeleteItemConfirm(true);
        setIndexDelete(dataIdx);
    };

    const handleCancelDelete = () => {
        setDeleteItemConfirm(false);
        setCheckedIndex(-1);
        // setIndexDelete();
    };

    const deleteItem = (indexDelete: number) => {
        const pgm_map_name = data[indexDelete].map_name;
        const yaml_map_name = pgm_map_name.replace(".pgm", ".yaml");

        // delete pgm file
        axios.delete(`${backendUrl}/api/pgm_data`, {
            headers: {
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`
            },
            data: {
                map_name: pgm_map_name
            }
        })
            .then((response) => {
                console.log(response);
                // delete yaml file
                axios.delete(`${backendUrl}/api/yaml_data`, {
                    headers: {
                        'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                    },
                    data: {
                        map_name: yaml_map_name
                    }
                })
                    .then((response) => {
                        console.log(response)
                        // Update data
                        axios.get(`${backendUrl}/api/pgm_data`, {
                            headers: {
                                'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                            }
                        })
                            .then((response) => {
                                console.log(response);
                                setData(response.data.data);
                                setDeleteItemConfirm(false);
                                setCheckedIndex(-1);
                            })
                            .catch((error) => {
                                console.log(error);
                                alert("Map failed to delete")
                            });
                    })
                    .catch((error) => {
                        console.log(error);
                        alert("Map failed to delete")
                    });
            })
            .catch((error) => {
                console.log(error);
                alert("Map failed to delete")
            });
    };

    //search Item
    const handleSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const query = event.target.value;
        setSearchQuery(query);
    };

    const filteredData = data.filter((item) => {
        return item.map_name.toLowerCase().includes(searchQuery.toLowerCase());
    });

    const itemsPerPage = 10;
    const totalItems = filteredData.length;

    const pageOfDataChecker = (data: any) => {
        if (data.length <= 10 && data.length > 0) {
            return 1
        } else if (data.length > 10) {
            return Math.ceil(totalItems / itemsPerPage)
        } else {
            return 0
        }
    }
    const totalPages = pageOfDataChecker(data);

    // Ensure currentPage doesn't exceed totalPages when search is used
    useEffect(() => {
        if (currentPage > totalPages) {
            setCurrentPage(totalPages);
        }
    }, [totalPages, currentPage]);

    const findPageIndex = (mapId: String) => {

        const index = data.findIndex(item => item.mapId == mapId);

        // console.log("MAP ID :", mapId);
        // console.log("INDEX :", index);

        if (index === -1) {
            return 1; // Item not found
        }

        const pageNumber = Math.floor(index / itemsPerPage) + 1;

        return pageNumber;
    };

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    const currentData = filteredData.slice(startIndex, endIndex);

    const handleDoubleClick = (index: number) => {
        setIsEditing({ ...isEditing, [index]: true });
    };

    const currentIndex = Number(value);

    const updateMapName = (index: number) => {
        const inputElement = document.getElementById(`mapNameInput${index}`);
        if (inputElement instanceof HTMLInputElement) {
            const oldName = data[startIndex + index].map_name;
            const newName = `${inputElement.value}.pgm`;

            if (newName !== oldName) {
                axios.put(`${backendUrl}/api/pgm_data`, {
                    map_name: oldName,
                    new_map_name: newName
                }, {
                    headers: {
                        'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                    }
                })
                    .then(response => {
                        console.log('PGM Data Update Response:', response);
                        if (response.status === 200) {
                            axios.get(`${backendUrl}/api/pgm_data`, {
                                headers: {
                                    'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                                }
                            })
                                .then(res => {
                                    const data = res.data.data
                                    setData(data);
                                    alert("Map name updated successfully");
                                })
                                .catch(err => {
                                    alert("Error refreshing data");
                                })
                        }
                        else {
                            alert("Map failed to update")
                        }
                    })
                    .catch(error => {
                        console.error('Error updating map name:', error);
                    });
            }
        } else {
            console.error('Input element not found');
        }

        setIsEditing({ ...isEditing, [index]: false });
    };

    const updateMapNameMobile = (index: any, newName: string, oldName: string) => {

        if (newName.length > 0 && newName !== oldName) {
            axios.put(`${backendUrl}/api/pgm_data`, {
                map_name: `${oldName}.pgm`,
                new_map_name: `${newName}.pgm`
            }, {
                headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                }
            })
                .then(response => {
                    console.log('PGM Data Update Response:', response);
                    if (response.status === 200) {
                        axios.get(`${backendUrl}/api/pgm_data`, {
                            headers: {
                                'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                            }
                        })
                            .then(res => {
                                const data = res.data.data
                                setData(data);
                                alert("Map name updated successfully");
                            })
                            .catch(err => {
                                alert("Error refreshing data");
                            })
                    }
                    else {
                        alert("Map failed to update")
                    }
                })
                .catch(error => {
                    console.error('Error updating map name:', error);
                });
        } else {
            console.log("newName cannot be null");

        }
    };

    function getBaseName(fileName: any) {
        return fileName.substring(0, fileName.lastIndexOf('.')) || fileName;
    }

    const handleInfoIconClick = () => {
        setShowControlInstruction(!showControlInstruction); // Toggle the state
    };

    const handleControlInstructionClick = () => {
        setShowControlInstruction(false);
        sessionStorage.setItem('firstLoadDatabasePage', 'false')
        setFirstLoaded('false')
    };

    const handleCloseButtonClick = () => {
        setShowConfirmDialog(true); // or false, depending on your logic
    };

    let pathname = usePathname()
    let iconPage;

    if (pathname == "/unit/control") {
        pathname = "Control Mode"
        iconPage = "/icons/Marker.svg"
    }

    if (pathname == "/unit/mapping") {
        pathname = "Mapping"
        iconPage = "/icons/mapping.svg"
    }

    if (pathname == "/unit/database") {
        pathname = "Database"
        iconPage = "/icons/database.svg"
    }

    const handleMobileNavigation = () => {
        setMobileNavigation(!mobileNavigation);
    }

    const handleMobileInstruction = () => {
        setMobileInstruction(!mobileInstruction);

        sessionStorage.setItem('firstLoadDatabasePage', 'false')
        setFirstLoaded('false')
    }

    const handleMobileSorterDisplay = () => {
        setMobileSorterDisplay(!mobileSorterDisplay)
    }

    // Check if the media query matches and call the function if it does
    function handleMobileMapDisplay(mapName: any, index: any) {
        if (index == "-1") {
            setIndexMapChoosed(index)
            setMobileMapName(mapName)
            // setCheckedIndex(startIndex + parseInt(index));
            setMobileMapDisplay(!mobileMapDisplay)
        } else {
            setIndexMapChoosed(index)

            // console.log("indexMapChoosed : ", indexMapChoosed);
            // console.log("index clicked : ", index);



            const width = window.innerWidth;

            if (width < 1400) {
                // if (mapIndex == startIndex + parseInt(index)) {
                //     sessionStorage.setItem("mapIndex", "-1");
                //     setCheckedIndex(-1);
                // } else {
                //     setCheckedIndex(startIndex + parseInt(index));
                //     sessionStorage.setItem("mapIndex", String(startIndex + parseInt(index)));
                // }    
                setMobileMapName(mapName)
                // setCheckedIndex(startIndex + parseInt(index));
                setMobileMapDisplay(!mobileMapDisplay)
            }
        }

    }


    const handleMobileEditName = () => {
        setMobileEditNameDisplay(!mobileEditNameDisplay)
        setMobileMapDisplay(!mobileMapDisplay)
    }

    const handleMobileRemoveItem = () => {
        setMobileMapDisplay(!mobileMapDisplay)
        setDeleteItemConfirm(!deleteItemConfirm)
    }

    const handleNewNameChange = (event: any) => {
        setNewName(event.target.value);
    };

    const handleMapPreview = () => { }

    const handlePseudo = () => { }


    return (
        <ReduxProvider>
            {render ?
                (
                    <>
                        {' '}
                        <Head>
                            <title>Database</title>
                            <meta name="viewport" content="initial-scale=1.0, width=device-width" />
                        </Head>
                        <ConfirmElement
                            message="Are you sure you want to close this app?"
                            status={showConfirmDialog}
                            onCancel={handleCancel}
                        />
                        <ConfirmDelete
                            message="Are you sure you want to delete the map?"
                            status={deleteItemConfirm}
                            onCancel={handleCancelDelete}
                            onConfirm={() => deleteItem(indexDelete)}
                        />

                        {mobileNavigation ? <MobileNavigation onClick={handleMobileNavigation} /> : ""}
                        {mobileInstruction || firstLoaded == 'true' ? <MobileInstruction onClick={handleMobileInstruction} imgUrl={"/images/mobile_instruction_database.svg"} /> : ""}


                        <TokenExpired status={tokenExpired} />

                        {/* MOBILE SECTION */}
                        <div
                            className={`${styles.displayNone}  ${mobileSorterDisplay ? styles.mobileSortingnBackground : ""} ${mobileSorterDisplay ? styles.mobileDisplayFlex : ""}`}
                            onClick={handleMobileSorterDisplay}
                        >
                            <div className={`${styles.mobileSorting}`}>
                                <div className={styles.topSection}>
                                    <p>Sort By</p>
                                </div>

                                <div className={styles.mainSection}>
                                    <div className={`${styles.mapNameSection} ${styles.columnSection}`}>
                                        <div className={styles.title}>
                                            <p>Map Name</p>
                                        </div>
                                        <div className={styles.iconSection}>
                                            <div className={`${styles.sortIcon} ${sortOrderStatus == 'name' && sortOrder == 'asc' ? styles.sortIconActive : ""}`} onClick={() => handleMobileSortClick('name', 'asc')}>
                                                <img src="/icons/dsc_icon.svg" alt="" />
                                            </div>
                                            <div className={`${styles.sortIcon} ${sortOrderStatus == 'name' && sortOrder == 'desc' ? styles.sortIconActive : ""}`} onClick={() => handleMobileSortClick('name', 'desc')}>
                                                <img src="/icons/asc_icon.svg" alt="" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className={`${styles.dateModifiedSection} ${styles.columnSection}`}>
                                        <div className={styles.title}>
                                            <p>Date Modified</p>
                                        </div>
                                        <div className={styles.iconSection}>
                                            <div className={`${styles.sortIcon} ${sortOrderStatus == 'date' && sortOrder == 'asc' ? styles.sortIconActive : ""}`} onClick={() => handleMobileSortClick('date', 'asc')}>
                                                <img src="/icons/dsc_icon.svg" alt="" />
                                            </div>
                                            <div className={`${styles.sortIcon} ${sortOrderStatus == 'date' && sortOrder == 'desc' ? styles.sortIconActive : ""}`} onClick={() => handleMobileSortClick('date', 'desc')}>
                                                <img src="/icons/asc_icon.svg" alt="" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className={styles.titleBottomSection}>
                                    <p>Tap outside this box to exit</p>
                                </div>
                            </div>
                        </div>

                        <div
                            className={`${styles.displayNone}  ${mobileMapDisplay ? styles.mobileMapSelectorBackground : ""} ${mobileMapDisplay ? styles.mobileDisplayFlex : ""}`}
                        >
                            <div className={`${styles.mobileMapSelector}`}>
                                <div className={`${styles.mobileMapPreview}`}>
                                    <img src="/images/map.png" alt="" />
                                </div>
                                <div className={`${styles.mobileMapName}`}>
                                    <p>{mobileMapName}</p>
                                    {/* <p>MAP_NAME</p> */}
                                </div>
                                <div className={`${styles.mobileMapButtonSection}`}>
                                    <div className={`${styles.editNameButton}`} onClick={handleMobileEditName}>
                                        <img src="/icons/pencil.svg" alt="" />
                                    </div>
                                    <div className={`${styles.removeButton}`}>
                                        <img src="/icons/delete_mode_list.svg" alt="" onClick={handleMobileRemoveItem} />
                                    </div>
                                </div>
                                <div className={`${styles.mobileGoToMap}`}>
                                    <div
                                        className={`${styles.confirmMappingChoosed}`}
                                        onClick={goToControlWithIndex}
                                    >
                                        <p>Go to the Map</p>
                                        <Image src="/icons/3.svg" width={20} height={20} alt="play" />
                                    </div>
                                </div>
                                <div className={`${styles.mobileMapSelectorButton}`} onClick={() => handleMobileMapDisplay("", "-1")}>
                                    <p>Choose Another Map</p>
                                </div>
                            </div>
                        </div>

                        <div className={`${styles.displayNone}  ${mobileEditNameDisplay ? styles.mobileEditNameBackground : ""} ${mobileEditNameDisplay ? styles.mobileDisplayFlex : ""}`}>
                            <div className={styles.mobileEditName}>

                                <div className={styles.columnName}>
                                    <div className={styles.title}>
                                        Current
                                    </div>
                                    <div className={styles.input}>
                                        <p className={styles.separatedElement}>:</p>
                                        <input type="text" value={mobileMapName} placeholder={mobileMapName} disabled />
                                    </div>
                                </div>

                                <div className={`${styles.columnName} ${styles.newNameColumn}`}>
                                    <div className={`${styles.title} `}>
                                        New Name
                                    </div>
                                    <div className={styles.input}>
                                        <p className={styles.separatedElement}>:</p>
                                        <input
                                            type="text"
                                            autoFocus
                                            value={newName}
                                            onChange={handleNewNameChange}
                                        />
                                    </div>
                                </div>

                                <div className={`${styles.buttonSection}`}>
                                    <div className={`${styles.rename}`} onClick={() => updateMapNameMobile(indexMapChoosed, newName, mobileMapName)}>
                                        <p>Rename</p>
                                    </div>
                                    <div className={`${styles.cancel}`} onClick={handleMobileEditName}>
                                        <p>Cancel</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* ----------------- */}

                        <div className={styles.container}>
                            {showControlInstruction || firstLoaded == 'true' ? <ControlInstruction onClick={handleControlInstructionClick} height={80} imgUrl='/images/instruction_database.svg' /> : ''}

                            <div className={styles.parents}>
                                <div className={`${styles.topSection} ${styles.mobileDisplayNone}`}>
                                    <GreetingsUnit />
                                </div>

                                <MobileTopSection onConfirmButtonClick={handleCloseButtonClick} />

                                <div className={styles.mobileDisplayNone}>
                                    <CloseButton onClick={onConfirmButtonClick} />
                                </div>


                                <div className={styles.unitParents}>
                                    <div className={`${styles.navigation} ${styles.mobileDisplayNone}`}>
                                        <Navigation />
                                    </div>

                                    <MobileLidarSection // Use the new component here
                                        isChecked={isChecked}
                                        handleCheckboxChange={handleLidarChecked}
                                    />

                                    {/* MOBILE SECTION */}
                                    <div className={styles.mapSection}>
                                        <div className={`${styles.topSection} ${styles.mobileDisplayNone}`}>
                                            <div className="">
                                                <p>Map Collection</p>
                                            </div>

                                            <div className={styles.searchBar}>
                                                <input
                                                    type="text"
                                                    placeholder="Search..."
                                                    value={searchQuery}
                                                    onChange={handleSearchInputChange}
                                                />
                                                <img src="/icons/search_icon.svg" alt="" className={styles.largeScreenImage} />
                                            </div>
                                        </div>


                                        <div className={styles.mainSection}>

                                            <div className={`${styles.displayNone} ${styles.searchBarMobile} `}>
                                                <input
                                                    type="text"
                                                    placeholder="Search..."
                                                    value={searchQuery} // Set the input value to searchQuery
                                                    onChange={handleSearchInputChange} // Call the handler on input change
                                                />
                                                <img src="/icons/search_icon.svg" alt="" className={styles.largeScreenImage} />
                                            </div>

                                            <table className={styles.theTable}>
                                                <thead>
                                                    <tr className={styles.header}>
                                                        <th className={styles.idColumn} style={{ borderTopLeftRadius: '5px' }}>No.</th>
                                                        <th className={`${styles.sortableHeader} ${styles.mapNameColumn} `}>
                                                            <div className={`${styles.sortableHeaderContainer}`}>
                                                                <div className={`${styles.headerContent} ${styles.spanSorter} `}>
                                                                    <span>Map Name</span>
                                                                </div>
                                                                <Image
                                                                    className={styles.mobileDisplayNone}
                                                                    alt=""
                                                                    src={`/icons/${sortOrder}ending.svg`}
                                                                    width={40}
                                                                    height={40}
                                                                    onClick={handleSortClick}
                                                                />
                                                            </div>
                                                        </th>

                                                        <th className={`${styles.sortableHeader} ${styles.dateModifiedColumn}`} style={{ borderTopRightRadius: '5px' }}>
                                                            <div className={`${styles.sortableHeaderContainer}`} >
                                                                <div className={`${styles.headerContent} ${styles.spanSorter} `} >
                                                                    <span>Date Modified</span>
                                                                </div>
                                                                <Image
                                                                    className={styles.mobileDisplayNone}
                                                                    alt=""
                                                                    src={`/icons/${sortDateOrder}ending.svg`}
                                                                    width={40}
                                                                    height={40}
                                                                    onClick={handleDateSortClick}
                                                                /></div>

                                                        </th>
                                                        <th className={`${styles.fileType} ${styles.mobileDisplayNone}`}>File Type</th>
                                                        <th className={`${styles.fileSize} ${styles.mobileDisplayNone}`}>Size</th>
                                                        <th className={`${styles.selectedMap} ${styles.mobileDisplayNone}`}>Selected<br /> Map to Load</th>
                                                        <th className={`${styles.delete} ${styles.mobileDisplayNone}`}>Delete</th>
                                                    </tr>
                                                </thead>

                                                <tbody>
                                                    {currentData.map((item, index) => {
                                                        // console.log("currentPage : ", currentPage);
                                                        // console.log("currentIndex : ", currentIndex);


                                                        return (
                                                            (
                                                                <tr key={index} onClick={() => handleMobileMapDisplay(item.map_name, item.mapId)} className={` ${currentIndex == item.mapId ? styles.mapMobileSelected : ''}`}>
                                                                    <td>{index + 1 + (currentPage - 1) * itemsPerPage}</td>

                                                                    <td onDoubleClick={() => handleDoubleClick(index)}>
                                                                        {isEditing[index] ? (
                                                                            <input
                                                                                type="text"
                                                                                id={`mapNameInput${index}`} // Assign the ID here
                                                                                defaultValue={getBaseName(item.map_name)} // Remove the extension before editing
                                                                                onBlur={() => updateMapName(index)}
                                                                                autoFocus
                                                                            />
                                                                        ) : (
                                                                            getBaseName(item.map_name) // Display the name without the extension
                                                                        )}
                                                                    </td>

                                                                    <td className={styles.sortableHeader}>{convertTo24HourFormat(item.modified_time)}</td>
                                                                    <td className={`${styles.mobileDisplayNone}`}>{item.file_type}</td>
                                                                    <td className={`${styles.fileSize} ${styles.mobileDisplayNone}`}>{item.file_size}</td>
                                                                    <td className={`${styles.dark} ${styles.mobileDisplayNone}`}>
                                                                        <div className={`${styles.inputContainer}`}>
                                                                            <input
                                                                                type="checkbox"
                                                                                id={`checklistItem${index}`}
                                                                                // checked={checkedIndex == item.mapId}
                                                                                checked={currentIndex == item.mapId}
                                                                                onChange={() => handleCheckboxChange(item.mapId)}
                                                                            />
                                                                            <label htmlFor={`checklistItem${index}`}></label>
                                                                        </div>
                                                                    </td>
                                                                    <td className={`${styles.dark} ${styles.delete} ${styles.mobileDisplayNone}`}>
                                                                        <Image
                                                                            src="/icons/Delete.svg"
                                                                            alt="Delete icons"
                                                                            height={30}
                                                                            width={30}
                                                                            onClick={() => handleDeleteItem(index)}
                                                                        />
                                                                    </td>
                                                                </tr>
                                                            )
                                                        )
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>

                                        <div className={styles.bottomSection}>
                                            {/* ${(initialCheckedIndex !== null && parseInt(initialCheckedIndex) > -1) || mapIndex > -1 ? "" : styles.disable}  */}
                                            <div
                                                className={`
                                                    ${styles.confirmMappingChoosed} 
                                                ${Number(value) > -1 ? "" : styles.disable}
                                                        
                                                ${styles.mobileDisplayNone}`}
                                                onClick={goToControlWithIndex}
                                            >
                                                <p>Go to the Map</p>
                                                <Image src="/icons/3.svg" width={20} height={20} alt="play" />
                                            </div>

                                            <div className={styles.pagination}>
                                                <button
                                                    className={`${styles.buttonPagination} ${currentPage === 1 ? styles.buttonDisable : ""
                                                        }`}
                                                    onClick={() => handlePaginationButtonClick("first")}
                                                    disabled={currentPage === 1}
                                                >
                                                    {currentPage === 1 ?
                                                        <Image
                                                            src="/icons/arrow-left-green-2.png"
                                                            alt="button left"
                                                            width={10}
                                                            height={10}
                                                        /> :
                                                        <Image
                                                            src="/icons/2 left.svg"
                                                            alt="button left"
                                                            width={10}
                                                            height={10}
                                                        />
                                                    }
                                                </button>
                                                <button
                                                    className={`${styles.buttonPagination} ${currentPage === 1 ? styles.buttonDisable : ""
                                                        }`}
                                                    onClick={() => handlePaginationButtonClick("prev")}
                                                    disabled={currentPage === 1}
                                                >
                                                    {currentPage === 1 ?
                                                        <Image
                                                            src="/icons/arrow-left-green-1.png"
                                                            alt="button left"
                                                            width={10}
                                                            height={10}
                                                        /> :
                                                        <Image
                                                            src="/icons/1 left.svg"
                                                            alt="button left"
                                                            width={10}
                                                            height={10}
                                                        />
                                                    }
                                                </button>

                                                <div className={styles.currentPage}>
                                                    <input
                                                        className={styles.pageInput}
                                                        type="text"
                                                        value={currentPage}
                                                        onChange={(e) => {
                                                            const newValue = e.target.value;
                                                            if (
                                                                /^[0-9]*$/.test(newValue) &&
                                                                parseInt(newValue) >= 1 &&
                                                                parseInt(newValue) <= totalPages
                                                            ) {
                                                                setCurrentPage(parseInt(newValue));
                                                            }
                                                        }}
                                                    />
                                                </div>

                                                <p>of</p>
                                                <p>{totalPages}</p>
                                                <button
                                                    className={`${styles.buttonPagination} ${currentPage === totalPages ? styles.buttonDisable : ""
                                                        }`}
                                                    onClick={() => handlePaginationButtonClick("next")}
                                                    disabled={currentPage === totalPages}
                                                >
                                                    {currentPage === totalPages ?
                                                        <Image
                                                            src="/icons/arrow-right-green-1.png"
                                                            alt="button left"
                                                            width={10}
                                                            height={10}
                                                        />
                                                        :

                                                        <Image
                                                            src="/icons/1 right.svg"
                                                            alt="button left"
                                                            width={10}
                                                            height={10}
                                                        />
                                                    }
                                                </button>
                                                <button
                                                    className={`${styles.buttonPagination} ${currentPage === totalPages ? styles.buttonDisable : ""
                                                        }`}
                                                    onClick={() => handlePaginationButtonClick("last")}
                                                    disabled={currentPage === totalPages}
                                                >
                                                    {currentPage === totalPages ?
                                                        <Image
                                                            src="/icons/arrow-right-green-2.png"
                                                            alt="button left"
                                                            width={10}
                                                            height={10}
                                                        />
                                                        :

                                                        <Image
                                                            src="/icons/2 right.svg"
                                                            alt="button left"
                                                            width={10}
                                                            height={10}
                                                        />
                                                    }
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <MobileBottomSection
                                        handleMobileNavigation={handleMobileNavigation}
                                        handleMapPreview={handleMapPreview}
                                        handleMobileInstruction={handleMobileInstruction}
                                        handleMobileSorterDisplay={handleMobileSorterDisplay}
                                        mapIndex={false}
                                    />

                                </div>

                                <ButtonInformation onClick={handleInfoIconClick} />


                                <div className={`${styles.mobileDisplayNone} ${styles.footerSection}`}>
                                    <Footer status={false} />
                                </div>
                            </div>
                        </div>
                    </>
                ) : <></>}
        </ReduxProvider>
    );
}
