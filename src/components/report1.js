import * as React from "react";
import Box from "@mui/material/Box";
import { useState, useEffect, useRef } from "react";
import { MenuItem, Button } from "@mui/material";
import Swal from "sweetalert2";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Collapse from "@mui/material/Collapse";
import { IconButton } from "@mui/material";
import { AiFillCaretDown, AiFillCaretUp } from "react-icons/ai";
import SortAndPage from "./sortAndPage";

export default function Report1(){
    const [rows, setRows] = useState([]);
    const [open, setOpen] = useState(Array(rows.length).fill(false));
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [paginatedRows, setPaginatedRows] = useState(rows);
    const [filteredRows, setFilteredRows] = useState(rows);
    const initial = useRef(false);
    const [year, setYear] = useState("");
    const [month, setMonth] = useState("");
    const [day, setDay] = useState("");
    const [sortDate, setSortDate] = useState("desc");
    const [sortOrderCount, setSortOrderCount] = useState("desc");
    const [sortMenuCount, setSortMenuCount] = useState("desc");
    const [sortTotal, setSortTotal] = useState("desc");
    
    const sortAndPage = SortAndPage();
    const pagination = sortAndPage.pagination;
    const sortByInt = sortAndPage.sortByInt;
    const sortByDate = sortAndPage.sortByDate;
    const sortOrder = sortAndPage.sortOrder;
    const setSortOrder = sortAndPage.setSortOrder;
    const years = sortAndPage.years;
    const months = sortAndPage.months;


    const handleChangeYear = (event) => {
      setYear(event.target.value);
    };
  
    const handleChangeMonth = (event) => {
      setMonth(event.target.value);
    };
  
    const handleChangeDay = (event) => {
      setDay(event.target.value);
    };

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

    function handleReset() {
      setYear("");
      setMonth("");
      setDay("");
      setPage(0);
      setRowsPerPage(5);
      setOpen(Array(rows.length).fill(false));
    }

    function handlePopUp(row, row1) {
      Swal.fire({
        title: "รายการคำสั่งซื้อ",
        html: `<p>ชื่อ: ${row.name}</p>
               <p>ราคารวม: ${row.price} บาท</p>
               <p>วันที่ ${row1.date}</p>
               <p>เวลา: ${row.time}</p>`,
        /* customClass: {
          title: styles['custom-title-class'],
          html: styles['customText'],
        }, */
      });
    }

    function formatDate(dateString) {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const day = date.getDate().toString().padStart(2, "0");
      return `${month}/${day}/${year}`;
    }

    /* const handleChange = (event, newValue) => {
      setValue(newValue);
      setYear("");
      setMonth("");
      setDay("");
      setTime("");
      setPage(0);
      setRowsPerPage(5);
      setOpen(Array(rows.length).fill(false));
    }; */

   /*  const fetchReport1 = async () => {
      try {
        const res = await fetch('http://localhost:5000/report1');
        const data = await res.json();
        const formattedData = data.map(item => ({
          ...item,
          date: formatDate(item.date),
        }));
        setRows(formattedData);
        console.log(data);
      } catch (error) {
        console.error(`Error fetching data from ${url}:`, error);
      }
    }
     */

    useEffect(() => {
        async function fetchReport1() {
          try {
            const res = await fetch("http://localhost:5000/report1");
            const data = await res.json();
            const formattedData = data.map(item => ({
              ...item,
              date: formatDate(item.date),
            }));
            setRows(formattedData);
            console.log(formattedData);
          } catch (error) {
            console.error("Error fetching report1:", error);
          }
        }

        if (!initial.current) {
            initial.current = true;
            console.log(initial.current);
            fetchReport1();
        }
      
    }, []);

    // filter Table 1

    useEffect(() => {
      if (year) {
        const filteredRowsByYear = rows.filter((row) => row.date.endsWith(`/${year}`));
        setFilteredRows(filteredRowsByYear);
      } else if (month) {
        const filteredRowsByMonth = rows.filter((row) => row.date.startsWith(`0${month}`));
        setFilteredRows(filteredRowsByMonth);
      } else if (year && month) {
        const filteredRowsByMonth = rows.filter(
          (row) => row.date.startsWith(`0${month}`) && row.date.endsWith(`/${year}`)
        );
        setFilteredRows(filteredRowsByMonth);
      } else {
        setFilteredRows(rows);
      }
    }, [year, month, rows]);

    // Pagination 1

    useEffect(() => {
      const startIndex = page * rowsPerPage;
      const endIndex = startIndex + rowsPerPage;
      setPaginatedRows(filteredRows.slice(startIndex, endIndex));
    }, [filteredRows, page, rowsPerPage]);

    return (
        <Box>
            <TableContainer>
              <Box sx={{display: 'flex'}}>
                {renderDropdown("รายปี", years, year, handleChangeYear)}
                {renderDropdown("รายเดือน", months, month, handleChangeMonth)}
                <Box sx={{marginTop:'15px', marginLeft:'20px'}}>
                  <Button sx={{fontSize:'16px'}} variant="contained" onClick={handleReset}>
                    RESET
                  </Button>
                </Box>
              </Box>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell><Button sx={{fontSize:'25px'}} onClick={() => {sortByInt(paginatedRows, "order", sortOrder, setSortOrder);}}>ลำดับ</Button></TableCell>
                    <TableCell><Button sx={{fontSize:'25px'}} onClick={() => {sortByDate(paginatedRows, "date", sortDate, setSortDate);}}>วันที่</Button></TableCell>
                    <TableCell><Button sx={{fontSize:'25px'}} onClick={() => {sortByInt(paginatedRows, "orderCount", sortOrderCount, setSortOrderCount);}}>จำนวนออเดอร์</Button></TableCell>
                    <TableCell><Button sx={{fontSize:'25px'}} onClick={() => {sortByInt(paginatedRows, "menuCount", sortMenuCount, setSortMenuCount);}}>จำนวนสินค้า</Button></TableCell>
                    <TableCell><Button sx={{fontSize:'25px'}} onClick={() => {sortByInt(paginatedRows, "total", sortTotal, setSortTotal);}}>จำนวนยอดขาย</Button></TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {paginatedRows.map((row, index) => (
                    <>
                      <TableRow
                        key={row._id}
                        sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                        <TableCell sx={{fontSize:'22px'}}><p style={{marginLeft:'35px'}}>{row.id}</p></TableCell>
                        <TableCell sx={{fontSize:'22px'}}>{row.date}</TableCell>
                        <TableCell  sx={{fontSize:'22px'}}><p style={{marginLeft:'80px'}}>{row.countOrder}</p></TableCell>
                        <TableCell sx={{fontSize:'22px'}}><p style={{marginLeft:'70px'}}>{row.countMenu}</p></TableCell>
                        <TableCell sx={{fontSize:'22px'}}><p style={{marginLeft:'60px'}}>{`${row.total} บาท`}</p></TableCell>
                        <TableCell>
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
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                          <Collapse in={open[index]} timeout="auto" unmountOnExit>
                            <Box sx={{ margin: 1 }}>
                              <Table aria-label="purchases">
                                  <TableRow style={{backgroundColor:'#EADDCD'}}>
                                    <TableCell sx={{fontSize:'20px'}}>ลำดับ</TableCell>
                                    <TableCell sx={{fontSize:'20px'}}>เมนู</TableCell>
                                    <TableCell sx={{fontSize:'20px'}}>เวลา</TableCell>
                                    <TableCell sx={{fontSize:'20px'}}>ราคา</TableCell>
                                  </TableRow>

                                <TableBody>
                                  {row.history.map((historyRow) => (
                                    <TableRow
                                    style={{backgroundColor:'#FCF6EE'}}
                                      onClick={() => handlePopUp(historyRow, row)}
                                      key={historyRow.id}>
                                      <TableCell >
                                      <p style={{marginLeft:'18px'}}>{historyRow.id}</p>
                                      </TableCell>
                                      <TableCell sx={{fontSize:'18px'}}>{historyRow.name}</TableCell>
                                      <TableCell sx={{fontSize:'18px'}}>{historyRow.time}</TableCell>
                                      <TableCell sx={{fontSize:'18px'}}>{historyRow.price} บาท</TableCell>
                                    </TableRow>
                                  ))}
                                  {/* <TablePagination
                                    rowsPerPageOptions={[5, 10, 25, { label: 'All', value: 1000000 }]}
                                    colSpan={3}
                                    count={paginatedRows.length} // Update this line for each tab
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    SelectProps={{
                                      inputProps: {
                                        'aria-label': 'rows per page',
                                      },
                                      native: true,
                                    }}
                                    onPageChange={handleChangePage}
                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                    ActionsComponent={TablePaginationActions}
                                  /> */}
                                </TableBody>
                              </Table>
                            </Box>
                          </Collapse>
                        </TableCell>
                      </TableRow>
                    </>
                  ))}
                </TableBody>
              </Table>
              <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
                {pagination(filteredRows)}
              </Box>
            </TableContainer>
          </Box>
    )
}