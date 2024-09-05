import * as React from "react";
import { useState} from "react";
import { MenuItem } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import TablePagination from "@mui/material/TablePagination";
import TablePage from "../components/TablePagination";

export default function SortAndPage(){
    const [sortOrder, setSortOrder] = useState("desc");
    const [sortDate, setSortDate] = useState("desc");
    const [sortOrderCount, setSortOrderCount] = useState("desc");
    const [sortMenuCount, setSortMenuCount] = useState("desc");
    const [sortTotal, setSortTotal] = useState("desc");
    const [sortCount, setSortCount] = useState("desc");
    const [sortPrice, setSortPrice] = useState("desc");
    const [sortTime, setSortTime] = useState("desc");
    const [sortName, setSortName] = useState("desc");
    const [sortStatus, setSortStatus] = useState("desc");
    const [sortType, setSortType] = useState("desc");
    const [rows, setRows] = useState([]);
    const [rows2, setRows2] = useState([]);
    const [rows3, setRows3] = useState([]);
    const [filteredRows, setFilteredRows] = useState(rows);
    const [filteredRows2, setFilteredRows2] = useState(rows2);
    const [filteredRows3, setFilteredRows3] = useState(rows3);
    const [startTime, setStartTime] = useState("");
    const [finishTime, setFinishTime] = useState("");
    const [open, setOpen] = useState(Array(rows.length).fill(false));
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [paginatedRows, setPaginatedRows] = useState(rows);
    const [paginatedRows2, setPaginatedRows2] = useState(rows2);
    const [paginatedRows3, setPaginatedRows3] = useState(rows3);

    const years = [];
    for (let i = 2023; i >= 2013; i--) {
      years.push(i.toString());
    }

    const months = [
      "","มกราคม","กุมภาพันธ์","มีนาคม","เมษายน","พฤษภาคม","มิถุนายน","กรกฎาคม","สิงหาคม","กันยายน","ตุลาคม","พฤศจิกายน","ธันวาคม",
    ];

    const days = [""];
    for (let i = 1; i <= 31; i++) {
      days.push(i);
    }

    const timeArray = [];
    for (let hour = 0; hour < 24; hour++) {
      const formattedHour = hour.toString().padStart(2, "0");
      timeArray.push(`${formattedHour}:00:00`);
    }

    function renderDropdown(label, options, value, onChange) {
      return (
        <FormControl sx={{ m: 1, minWidth: 120 }}>
          <InputLabel id="demo-simple-select-label">{label}</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={value}
            label={label}
            onChange={onChange}
          >
            {options.map((option, index) => (
              <MenuItem key={option} value={index}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      );
    }
  
    function pagination(filteredRows) {
      return (
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, { label: "All", value: 1000000 }]}
          colSpan={3}
          count={filteredRows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          SelectProps={{
            inputProps: {
              "aria-label": "rows per page",
            },
            native: true,
          }}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          ActionsComponent={TablePage}
        />
      );
    }
  
    const handleChangePage = (event, newPage) => {
      setPage(newPage);
    };
  
    const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
    };
  
    function sortByInt(row, column, sort, setSort) {
      if (sort === "asc") {
        row.sort((a, b) => b[column] - a[column]);
        setSort("desc");
      } else {
        row.sort((a, b) => a[column] - b[column]);
        setSort("asc");
      }
    }
  
    function sortByString(row, column, sort, setSort) {
      if (sort === "asc") {
        row.sort((a, b) => (a[column] > b[column] ? -1 : 1));
        setSort("desc");
      } else {
        row.sort((a, b) => (a[column] < b[column] ? -1 : 1));
        setSort("asc");
      }
    }
  
    function sortByDate(row, column, sort, setSort) {
      if (sort === "asc") {
        row.sort((a, b) => new Date(b[column]) - new Date(a[column]));
        setSort("desc");
      } else {
        row.sort((a, b) => new Date(a[column]) - new Date(b[column]));
        setSort("asc");
      }
    }
  
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
  
    function sortByTime(row) {
      if (sortTime === "asc") {
        row.sort((a, b) => {
          const timeA = convertTimeToMinutes(a.time);
          const timeB = convertTimeToMinutes(b.time);
          return timeA - timeB;
        });
        setSortTime("desc");
      } else {
        row.sort((a, b) => {
          const timeA = convertTimeToMinutes(a.time);
          const timeB = convertTimeToMinutes(b.time);
          return timeB - timeA;
        });
        setSortTime("asc");
      }
    }

    function formatDate(dateString) {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const day = date.getDate().toString().padStart(2, "0");
      return `${month}/${day}/${year}`;
    }

    return {
      pagination,handleChangePage,handleChangeRowsPerPage,sortByInt,sortByString,sortByDate,sortByTime,sortOrder,setSortOrder,sortDate,setSortDate,
      sortOrderCount,setSortOrderCount,sortMenuCount,setSortMenuCount,sortTotal,setSortTotal,sortCount,setSortCount,sortPrice,setSortPrice,sortTime,
      setSortTime,sortName,setSortName,sortStatus,setSortStatus,sortType,setSortType,rows,setRows,rows2,setRows2,rows3,setRows3,filteredRows,setFilteredRows,
      filteredRows2,setFilteredRows2,filteredRows3,setFilteredRows3,startTime,setStartTime,finishTime,setFinishTime,open,setOpen,page,setPage,
      rowsPerPage,setRowsPerPage,paginatedRows,setPaginatedRows,paginatedRows2,setPaginatedRows2,paginatedRows3,setPaginatedRows3,renderDropdown,
      years,months,days,timeArray,formatDate
    };
}