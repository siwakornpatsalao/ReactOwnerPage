import * as React from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { useState} from "react";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import Report1 from "src/components/report1";
import Report2 from "src/components/report2";
import Report3 from "src/components/report3";

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

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <DashboardLayout>
      <Box sx={{ width: "100%",marginLeft:'20px' }}>
      <h1 style={{ marginLeft: '50px' }}>Report</h1>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            textColor="secondary"
            indicatorColor="secondary"
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
            centered>
            <Tab sx={{fontSize:'25px'}} label="รายงานสินค้า" {...a11yProps(0)} />
            <Tab sx={{fontSize:'25px'}} label="รายงาน stock" {...a11yProps(1)} />
            <Tab sx={{fontSize:'25px'}} label="รายงานสินค้าขายดี" {...a11yProps(2)} />
          </Tabs>
        </Box>
        <CustomTabPanel value={value} index={0}>
          <Report1/>
          
        </CustomTabPanel>

        <CustomTabPanel value={value} index={1}>
          <Report2/>

        </CustomTabPanel>

        <CustomTabPanel value={value} index={2}>
          <Report3/>

        </CustomTabPanel>
        
      </Box>
    </DashboardLayout>
  );
}
