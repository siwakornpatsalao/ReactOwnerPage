import Box from "@mui/material/Box";
import { useState, useEffect, useRef } from "react";
import { TextField, MenuItem, Button, Typography } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import * as React from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import InputLabel from '@mui/material/InputLabel';
import { SeverityPill } from 'src/components/severity-pill';
import Swal from 'sweetalert2';
import TablePagination from "@mui/material/TablePagination";
import {TablePaginationActions as TablePage} from "../components/TablePagination";


/* function createData(order, menu, date, time, status) {
  return { order, menu, date, time, status };
}

const rowss = [
  createData(1, 'เบอร์เกอร์',"06/16/2023", '09:13:54','ยังไม่ชำระเงิน'),
  createData(2, 'เครปไส้แตก', "06/16/2023", '09:35:57','ยังไม่ชำระเงิน'),
  createData(3, 'ชาเขียว',"06/16/2023", '09:43:52','ยังไม่ชำระเงิน'),
  createData(4, 'ชาเขียว, โกโก้',"06/16/2023", '10:12:26','ยังไม่ชำระเงิน'),
  createData(5, 'เครป 1 ไส้',"06/16/2023", '13:36:21','ยังไม่ชำระเงิน'),
  createData(6, 'เครปไส้แตก, ชาเขียว',"06/16/2023", '17:46:28','ยังไม่ชำระเงิน'),
]; */

const statusMap = {
  ยังไม่ชำระเงิน: 'warning',
  ชำระเงินแล้ว: 'success',
  refunded: 'error'
};

function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;
  
    return (
      <>
        <div
          role="tabpanel"
          hidden={value !== index}
          id={`simple-tabpanel-${index}`}
          aria-labelledby={`simple-tab-${index}`}
          {...other}
        >
          {value === index && (
            <Box sx={{ p: 3 }}>
              <div>{children}</div>
            </Box>
          )}
        </div>
      </>
    );
  }
  
CustomTabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};
  
function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
    };
}

export default function BasicTabs() {
    const [value, setValue] = useState(0);
    const [sortTime, setSortTime] = useState("desc");
    const [sortOrder, setSortOrder] = useState("desc");
    const [sortDate, setSortDate] = useState("desc");
    const [sortMenu, setSortMenu] = useState("desc");
    const [sortStatus, setSortStatus] = useState('desc');
    const [page, setPage] = useState(0);
    const [rows, setRows] = useState([]);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [paginatedRows, setPaginatedRows] = useState(rows);
    const [paidOrders, setPaidOrders] = useState([]);
    const [paginatedRows2, setPaginatedRows2] = useState(paidOrders);
    const initial = useRef(false);
    const currentTime = Date.now();
    const currentDate = new Date(currentTime).toLocaleDateString();

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
    
    const handleChange = (event, newValue) => {
        setValue(newValue);
        setRowsPerPage(10);
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

    function handlePopUp(row) {
      Swal.fire({
        title: "รายการคำสั่งซื้อ",
        html: `ออเดอร์ที่: ${row.id} <br><br>
               ชื่อ: ${row.menu} <br><br>
               เวลา: ${row.time} <br><br>
               สถานะ: ${row.status}`,
        confirmButtonText:'ยืนยันการชำระเงิน',
        confirmButtonColor: 'green',
        showCancelButton: true,
        cancelButtonColor: '#d33',
      }).then(async (result) => {
        if (result.isConfirmed) {
          // status เปลี่ยนเป็น ชำระเงินแล้ว
          const updatedRows = rows.map((r) => r.id === row.id ? { ...r, status: "ชำระเงินแล้ว" } : r);

          // add update to orderPaid
          // delete update in order
          /* handleAddPaidRow(row);
          handleDeleteRow(row); */

          const paidOrder = updatedRows.find((r) => r.id === row.id);
          if (paidOrder) {
            //setPaidOrders((prevPaidOrders) => [...prevPaidOrders, paidOrder]);
            handleAddPaidRow(row);
            handleDeleteRow(row);
            const updatedPendingOrders = rows.filter(
              (pendingOrder) => pendingOrder.id !== row.id
            );
            setRows(updatedPendingOrders);
          }
          // แสดงแค่แถวที่ยังไม่ชำระเงิน
        }});
      }

      function handlePopUpPaid(row){
        Swal.fire({
          title: "รายการคำสั่งซื้อ",
          html: `ออเดอร์ที่: ${row.id} <br><br>
                ชื่อ: ${row.menu} <br><br>
                เวลา: ${row.time} <br><br>
                สถานะ: ${row.status}`,
          confirmButtonText:'ยืนยันออเดอร์',
          confirmButtonColor: 'green',
          showCancelButton: true,
          cancelButtonColor: '#d33',
        }).then(async (result) =>{
          if(result.isConfirmed){
            // ลบแถวที่เลือก 
            handleDeletePaidRow(row)
          }
        })
      }

    async function handleAddPaidRow(row){
      row.status = "ชำระเงินแล้ว";
      try {
        const response = await fetch("http://localhost:5000/orderPaids", {
          method: "POST",
          body: JSON.stringify({
            id: row.id,
            menu: row.menu,
            time: row.time,
            status: row.status,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error("Failed to add new orderPaid");
        }
        const resJson = await response.json();
        console.log(resJson);
        setPaidOrders((prevPaidOrders) => [...prevPaidOrders, resJson]);
      } catch (error) {
        console.log("Error:", error.message);
      }
    }

    async function handleDeleteRow(row){
      try{
        const response = await fetch(`http://localhost:5000/orders/${row._id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Failed to delete order");
        }
        const resJson = await response.json();
        console.log(resJson);
        setRows((prevRows) => prevRows.filter((r) => r._id !== resJson._id));
      } catch (error) {
        console.log("Error:", error.message);
      }
    }

    async function handleDeletePaidRow(row){
      try{
        const response = await fetch(`http://localhost:5000/orderPaids/${row._id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Failed to delete paid order");
        }
        const resJson = await response.json();
        console.log(resJson);
        setPaidOrders((prevPaidOrders) => prevPaidOrders.filter((r) => r._id !== resJson._id));
      } catch (error) {
        console.log("Error:", error.message);
      }
    }

    useEffect(() => {
      async function fetchOrder() {
        try {
          const res = await fetch("http://localhost:5000/orders");
          const data = await res.json();
          setRows(data);
          console.log(data);
        } catch (error) {
          console.error("Error fetching menus:", error);
        }
      }

      async function fetchOrderPaid() {
        try {
          const res = await fetch("http://localhost:5000/orderPaids");
          const data = await res.json();
          setPaidOrders(data);
          console.log(data);
        } catch (error) {
          console.error("Error fetching menus:", error);
        }
      }
  
      if (!initial.current) {
        initial.current = true;
        console.log(initial.current);
        fetchOrder();
        fetchOrderPaid();
      }
      
    }, []);

    useEffect(() => {
      const startIndex = page * rowsPerPage;
      const endIndex = startIndex + rowsPerPage;
      setPaginatedRows(rows.slice(startIndex, endIndex));
      setPaginatedRows2(paidOrders.slice(startIndex, endIndex));
    }, [rows, page, rowsPerPage,paidOrders]);

    // pagination 
    // tab 1  ชำระเงินแล้ว
    // tab 2  ยังไม่ชำระเงิน

    return(
        <DashboardLayout >
            <Box sx={{ width: "100%",pl:'50px',marginTop:'40px'}}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Typography style={{marginLeft:'20px'}} variant="h4">{currentDate}</Typography>
          <Tabs
            textColor="secondary"
            indicatorColor="secondary"
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
            centered
          >
            <Tab sx={{fontSize:'25px'}} label="ชำระเงินแล้ว" {...a11yProps(0)} />
            <Tab sx={{fontSize:'25px'}} label="รอการชำระเงิน" {...a11yProps(1)} />
          </Tabs>
          <br/>
          </Box>
            <CustomTabPanel value={value} index={0}>

            <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell width="20%"> <Button sx={{fontSize:'25px'}} onClick={() => {sortByInt(paidOrders, "id", sortOrder, setSortOrder);}}>เลขที่ออเดอร์</Button></TableCell>
                  <TableCell width="20%"> <Button sx={{fontSize:'25px'}} onClick={() => {sortByString(paidOrders, "menu", sortMenu, setSortMenu);}}>เมนู</Button></TableCell>
                  <TableCell width="20%"> <Button sx={{fontSize:'25px'}} onClick={() => {sortByTime(paidOrders, "time", sortTime, setSortTime);}}> เวลา </Button></TableCell>
                  <TableCell width="20%"> <Button sx={{fontSize:'25px'}} onClick={() => {sortByString(paidOrders, "status", sortStatus, setSortStatus);}}> สถานะ</Button></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paidOrders.map((row) => (
                  <TableRow key={row._id}
                  /* onClick={() => handlePopUpPaid(row)} */>
                    <TableCell sx={{fontSize:'22px'}}>
                    <p style={{marginLeft:'60px'}}>{row.id}</p>
                    </TableCell>
                    <TableCell sx={{fontSize:'22px'}}>{row.menu}</TableCell>
                    <TableCell sx={{fontSize:'22px'}}>{row.time}</TableCell>
                    <TableCell>
                      <SeverityPill sx={{fontSize:'22px'}} onClick={() => handlePopUpPaid(row)} color={statusMap[row.status]}>
                        {row.status}
                      </SeverityPill>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
            {pagination(paidOrders)}
              </Box>
          </TableContainer>           

            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
                
            <TableContainer>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell  width="20%"> <Button sx={{fontSize:'25px'}} onClick={() => {sortByInt(paginatedRows, "id", sortOrder, setSortOrder);}}>เลขที่ออเดอร์</Button></TableCell>
                    <TableCell  width="20%"> <Button sx={{fontSize:'25px'}} onClick={() => {sortByString(paginatedRows, "menu", sortMenu, setSortMenu);}}> เมนู </Button> </TableCell>
                    {/* <TableCell> <Button onClick={() => {sortByDate(rows, "date", sortDate, setSortDate);}}> วันที่ </Button> </TableCell> */}
                    <TableCell  width="20%"> <Button sx={{fontSize:'25px'}} onClick={() => {sortByTime(paginatedRows, "time", sortTime, setSortTime);}}> เวลา </Button> </TableCell>
                    <TableCell  width="20%"> <Button sx={{fontSize:'25px'}} onClick={() => {sortByString(paginatedRows, "status", sortStatus, setSortStatus);}}> สถานะ</Button> </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                {paginatedRows.map((row) => (
                    <TableRow
/*                       onClick={() => handlePopUp(row)} */
                      key={row._id}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell sx={{fontSize:'22px'}}>
                      <p style={{marginLeft:'60px'}}>{row.id}</p>
                      </TableCell>
                      <TableCell sx={{fontSize:'22px'}}>{row.menu}</TableCell>
                      {/* <TableCell>{row.date}</TableCell> */}
                      <TableCell sx={{fontSize:'22px'}}>{row.time}</TableCell>
                      <TableCell>
                        <SeverityPill sx={{fontSize:'22px'}} onClick={() => handlePopUp(row)} color={statusMap[row.status]}>
                        {row.status}
                      </SeverityPill>
                        </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
                {pagination(rows)}
              </Box>
            </TableContainer>

            </CustomTabPanel>
            </Box>
        </DashboardLayout>
    )
}