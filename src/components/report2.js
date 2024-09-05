import * as React from "react";
import Box from "@mui/material/Box";
import { useState, useEffect, useRef } from "react";
import { Button } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Collapse from "@mui/material/Collapse";
import { IconButton } from "@mui/material";
import { AiFillCaretDown, AiFillCaretUp } from "react-icons/ai";
import SortAndPage from "./sortAndPage";
import Swal from "sweetalert2";

export default function Report2(){
    const initial = useRef(false);
    const [year, setYear] = useState("");
    const [month, setMonth] = useState("");
    const [day, setDay] = useState("");
    const [time, setTime] = useState("");
    const [startTime, setStartTime] = useState("");
    const [finishTime, setFinishTime] = useState("");
    const [rows2, setRows2] = useState([]);
    const [filteredRows2, setFilteredRows2] = useState(rows2);
    const [paginatedRows2, setPaginatedRows2] = useState(rows2);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [sortOrder, setSortOrder] = useState("desc");
    const [sortDate, setSortDate] = useState("desc");
    const [sortTime, setSortTime] = useState("desc");
    const [sortName, setSortName] = useState("desc");
    const [sortStatus, setSortStatus] = useState("desc");
    const [sortType, setSortType] = useState("desc");
    const [sortCount, setSortCount] = useState("desc");
    const [sortPrice, setSortPrice] = useState("desc");
    const [open, setOpen] = useState(Array(rows2.length).fill(false));

    const sortAndPage = SortAndPage();
    const pagination = sortAndPage.pagination;
    const sortByInt = sortAndPage.sortByInt;
    const sortByString = sortAndPage.sortByString;
    const sortByDate = sortAndPage.sortByDate;
    const sortByTime = sortAndPage.sortByTime;
    const renderDropdown = sortAndPage.renderDropdown;
    const years = sortAndPage.years;
    const months = sortAndPage.months;
    const days = sortAndPage.days;
    const timeArray = sortAndPage.timeArray;
    const formatDate = sortAndPage.formatDate;

    //const [filteredFinishTimeArray, setFilteredFinishTimeArray] = useState(timeArray);

    function handleReset() {
      setYear("");
      setMonth("");
      setDay("");
      setStartTime("");
      setFinishTime("");
      setPage(0);
      setRowsPerPage(5);
      setOpen(Array(rows2.length).fill(false));
    }

    const handleChangeYear = (event) => {
      setYear(event.target.value);
    };

    const handleChangeMonth = (event) => {
      setMonth(event.target.value);
    };

    const handleChangeDay = (event) => {
      setDay(event.target.value);
    };

    const handleChangeStartTime = (event) => {
      setStartTime(event.target.value);
/* 
      const selectedHours = parseInt(event.target.value);
    
      const filteredFinishTimes = timeArray.filter((time) => {
        const timeHours = parseInt(time);
        return timeHours > selectedHours;
      });
    
      setFilteredFinishTimeArray(filteredFinishTimes); */
    };
    

    const handleChangeFinishTime = (event) => {
      setFinishTime(event.target.value);
      if(startTime>event.target.value){
        Swal.fire('เวลาเริ่มมากกว่าเวลาสิ้นสุดไม่ได้');
        setFinishTime("");
      }
    };

    function convertTimeToMinutes(timeString) {
      const [hours, minutes, seconds] = timeString.split(":");
      return parseInt(hours) * 60 + parseInt(minutes) + parseInt(seconds) / 60;
    }
  
    function formatTimeFromHours(totalHours) {
      if (typeof totalHours !== "number" || isNaN(totalHours) || totalHours < 0) {
        return "00:00:00";
      }
  
      const hours = Math.floor(totalHours);
      const remainingHours = totalHours - hours;
      const minutes = Math.floor(remainingHours * 60);
      const seconds = Math.floor((remainingHours * 60 - minutes) * 60);
  
      const formattedHours = hours.toString().padStart(2, "0");
      const formattedMinutes = minutes.toString().padStart(2, "0");
      const formattedSeconds = seconds.toString().padStart(2, "0");
  
      return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
    }
    
    useEffect(() => {
        async function fetchReport2() {
            try {
              const res = await fetch("http://localhost:5000/report2");
              const data = await res.json();
              const formattedData = data.map(item => ({
                ...item,
                date: formatDate(item.date),
              }));
              setRows2(formattedData);
              console.log(data);
            } catch (error) {
              console.error("Error fetching report1:", error);
            }
        }
        if (!initial.current) {
            initial.current = true;
            console.log(initial.current);
            fetchReport2();
        }
    }, [formatDate]);

    useEffect(() => {
        function isTimeInRange(time, range) {
          const { startTime, finishTime } = range;
          const timeToCheck = time;
          const start = formatTimeFromHours(startTime);
          const finish = formatTimeFromHours(finishTime);
          return timeToCheck >= start && timeToCheck <= finish;
        }
    
        if (year || month || day || startTime || finishTime) {
          const filteredRowsByYear = rows2.filter((row) => {
            const yearMatches = !year || row.date.endsWith(`/${year}`);
            const monthMatches = !month || row.date.startsWith(`0${month}`);
            const dayMatches = !day || parseInt(row.date.split("/")[1]) === day;
            const timeMatches =
              !startTime || !finishTime || isTimeInRange(row.time, { startTime, finishTime });
            return yearMatches && monthMatches && dayMatches && timeMatches;
          });
          setFilteredRows2(filteredRowsByYear);
        } else {
          setFilteredRows2(rows2);
        }
      }, [year, month, day, time, startTime, finishTime, rows2]);
    
      // Pagination 2
    
      useEffect(() => {
        const startIndex = page * rowsPerPage;
        const endIndex = startIndex + rowsPerPage;
        setPaginatedRows2(filteredRows2.slice(startIndex, endIndex));
      }, [filteredRows2, page, rowsPerPage]);

    return(
        <TableContainer>
          <Box sx={{display: 'flex'}}>
            {renderDropdown("รายปี", years, year, handleChangeYear)}
            {renderDropdown("รายเดือน", months, month, handleChangeMonth)}
            {month && month === "กุมภาพันธ์"
              ? renderDropdown("รายวัน", days.slice(0, 29), day, handleChangeDay)
              : month === "เมษายน" ||
                month === "มิถุนายน" ||
                month === "กันยายน" ||
                month === "พฤศจิกายน"
              ? renderDropdown("รายวัน", days.slice(0, 30), day, handleChangeDay)
              : renderDropdown("รายวัน", days.slice(0, 31), day, handleChangeDay)}
            {renderDropdown("เวลาเริ่มต้น", timeArray, startTime, handleChangeStartTime)}
            {renderDropdown("เวลาสิ้นสุด", timeArray, finishTime, handleChangeFinishTime)}
            <Box sx={{marginTop:'15px', marginLeft:'20px'}}>
              <Button sx={{fontSize:'16px'}} variant="contained" onClick={handleReset}>
                RESET
              </Button>
            </Box>
          </Box>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell> <Button sx={{fontSize:'25px'}} onClick={() => { sortByInt(paginatedRows2, "order", sortOrder, setSortOrder); }} > ลำดับ </Button> </TableCell>
                  <TableCell> <Button sx={{fontSize:'25px'}} onClick={() => { sortByDate(paginatedRows2, "date", sortDate, setSortDate); }} > วันที่ </Button> </TableCell>
                  <TableCell> <Button sx={{fontSize:'25px'}} onClick={() => { sortByTime(paginatedRows2, "time", sortTime, setSortTime); }} > เวลา </Button> </TableCell>
                  <TableCell> <Button sx={{fontSize:'25px'}} onClick={() => { sortByString(paginatedRows2, "name", sortName, setSortName); }} > ชื่อรายการ </Button> </TableCell>
                  <TableCell> <Button sx={{fontSize:'25px'}} onClick={() => { sortByInt(paginatedRows2, "count", sortCount, setSortCount); }} > จำนวน </Button> </TableCell>
                  <TableCell> <Button sx={{fontSize:'25px'}} onClick={() => { sortByInt(paginatedRows2, "price", sortPrice, setSortPrice); }} > ราคา </Button> </TableCell>
                  <TableCell> <Button sx={{fontSize:'25px'}} onClick={() => { sortByString(paginatedRows2, "status", sortStatus, setSortStatus); }} > สถานะ </Button> </TableCell>
                  <TableCell> <Button sx={{fontSize:'25px'}} onClick={() => { sortByString(paginatedRows2, "type", sortType, setSortType); }} > ประเภท </Button> </TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedRows2.map((row, index) => (
                  <>
                  <TableRow
                    key={row._id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                    <TableCell component="th" scope="row" sx={{fontSize:'18px'}}>
                    <p style={{marginLeft:'35px'}}>{row.id}</p>
                    </TableCell>
                    <TableCell sx={{fontSize:'22px'}}>{row.date}</TableCell>
                    <TableCell sx={{fontSize:'22px'}}>{row.time}</TableCell>
                    <TableCell sx={{fontSize:'22px'}}>{row.name}</TableCell>
                    <TableCell sx={{fontSize:'22px'}}>{row.count}</TableCell>
                    <TableCell sx={{fontSize:'22px'}}>{row.price}</TableCell>
                    <TableCell sx={{fontSize:'22px'}}>{row.status}</TableCell>
                    <TableCell sx={{fontSize:'22px'}}>{row.type}</TableCell>
                    {row.type == 'ตัวเลือก' ? <TableCell>
                          <IconButton
                            aria-label="expand row"
                            size="small"
                            onClick={() => {
                              const newOpen = [...open];
                              newOpen[index] = !newOpen[index];
                              setOpen(newOpen);
                            }}>
                            {open[index] ? (<AiFillCaretUp style={{ color: "blue" }} />) : (<AiFillCaretDown />)}
                          </IconButton>
                      </TableCell>: null}
                  </TableRow>
                  
                  {row.type === 'ตัวเลือก' && (
                    <TableRow>
                      <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                        <Collapse in={open[index]} timeout="auto" unmountOnExit>
                          <Box sx={{ margin: 1 }}>
                            <Table size="small" aria-label="purchases">
                                <TableRow style={{backgroundColor:'#EADDCD'}}>
                                  <TableCell sx={{fontSize:'20px'}}>ตัวเลือก</TableCell>
                                  <TableCell sx={{fontSize:'20px'}}>ราคา</TableCell>
                                  <TableCell sx={{fontSize:'20px'}}>จำนวน</TableCell>
                                  <TableCell sx={{fontSize:'20px'}}>หน่วย</TableCell>
                                </TableRow>
                              <TableBody>
                                {row.detail.map((AddonRow) => (
                                  <TableRow style={{backgroundColor:'#FCF6EE'}} key={AddonRow.id}>
                                    <TableCell component="th" scope="row" sx={{fontSize:'18px'}}>
                                      {AddonRow.name}
                                    </TableCell>
                                    <TableCell sx={{fontSize:'18px'}}>{AddonRow.price}</TableCell>
                                    <TableCell sx={{fontSize:'18px'}}>{AddonRow.amount}</TableCell>
                                    <TableCell sx={{fontSize:'18px'}}>{AddonRow.unit}</TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>)}

                  </>
                ))}
              </TableBody>
            </Table>
            <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
              {pagination(filteredRows2)}
            </Box>
          </TableContainer>
    )
}