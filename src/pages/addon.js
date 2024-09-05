import Head from 'next/head';
import PlusIcon from '@heroicons/react/24/solid/PlusIcon';
import PropTypes from 'prop-types';
import {
  Box,
  Button,
  Container,
  Pagination,
  Stack,
  SvgIcon,
  Typography,
  Unstable_Grid2 as Grid
} from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { AddonSearch } from 'src/sections/adds/addon-search';
import { useEffect , useState, useRef} from 'react';
import { AddonCard } from 'src/sections/adds/addon-card';
import { OptionCard } from 'src/sections/adds/option-card';
import { OptionSearch } from 'src/sections/adds/option-search';
import Link from 'next/link';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import TablePagination from '@mui/material/TablePagination';

function CustomTabPanel(props) {
  const { children, value, index, resetState,setRowsPerPage,setPage, ...other } = props;

  useEffect(() => {
    if (resetState) {
      setRowsPerPage(8);
      setPage(0);
    }
  }, [value, resetState]);

  return (
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
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
  resetState: PropTypes.bool.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

function Addon(){
    const [Addons, setAddons] = useState([]);
    const initial = useRef(false);
    const [value, setValue] = useState(0);
    const [optionGroups, setOptionGroups] = useState([]);
    const [originalAddons, setOriginalAddons] = useState([]);
    const [originalOptions, setOriginalOptions] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(8);
    const [paginatedAddon, setPaginatedAddon] = useState(Addons);
    const [paginatedOptions, setPaginatedOptions] = useState(optionGroups);

    const handleChangePage = (event, newPage) => {
      setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
    };

    const handleChange = (event, newValue) => {
      setValue(newValue);
    };

    //filter search addon
    const handleSearchAddon = (searchValue) => {
      console.log(searchValue);
      if (searchValue !== '') {
        const filteredAddons = originalAddons.filter((addon) =>
          addon.name.toLowerCase().includes(searchValue.toLowerCase())
        );
        setAddons(filteredAddons);
      } else {
        setAddons(originalAddons);
      }
    };

    //filter search option
    const handleSearchOption = (searchValue) => {
      console.log(searchValue);
      if (searchValue !== '') {
        const filteredOptions = originalOptions.filter((option) =>
          option.name.toLowerCase().includes(searchValue.toLowerCase())
        );
        setOptionGroups(filteredOptions);
      } else {
        setOptionGroups(originalOptions);
      }
    };

    useEffect(() => {
      async function fetchData(url, setter, setterOrigin) {
        try {
          const res = await fetch(url);
          const data = await res.json();
          setter(data);
          setterOrigin(data);
          console.log(data);
        } catch (error) {
          console.error(`Error fetching data from ${url}:`, error);
        }
      }
    
        if (!initial.current) {
          initial.current = true;
          console.log(initial.current);
          fetchData("http://localhost:5000/Addons",setAddons, setOriginalAddons);
          fetchData('http://localhost:5000/optiongroups',setOptionGroups, setOriginalOptions);
        }
        
      }, []);

      useEffect(() => {
        const startIndex = page * rowsPerPage;
        const endIndex = startIndex + rowsPerPage;
        setPaginatedAddon(Addons.slice(startIndex, endIndex));
      }, [Addons, page, rowsPerPage]);

      useEffect(() => {
        const startIndex = page * rowsPerPage;
        const endIndex = startIndex + rowsPerPage;
        setPaginatedOptions(optionGroups.slice(startIndex, endIndex));
      }, [optionGroups, page, rowsPerPage]);

  return (
        <>
    <Head>
      <title>
        Addon | Devias Kit
      </title>
    </Head>
    <Box
      component="main"
      /* sx={{ backgroundColor: '#EEF8F7'}} */
      /* sx={{ backgroundColor: '#f5f5f5'}} */
    >
      <Container maxWidth="xl" sx={{marginTop: '40px'}}>
        <Stack spacing={3}>
          <Stack
            direction="row"
            justifyContent="space-between"
            spacing={4}
          >
            <Stack spacing={1}>
              <Typography style={{marginLeft:'24px',marginTop:'7px'}}  variant="h4">
                Addon
              </Typography>
            </Stack>
              <Link href="./add/addAddon">
              <Button
                startIcon={(
                  <SvgIcon fontSize="small">
                    <PlusIcon />
                  </SvgIcon>
                )}
                variant="contained"
                sx={{fontSize:'20px'}}
              >
                เพิ่ม Addon
              </Button>
              </Link>
          </Stack>
          <Tabs
            textColor="secondary"
            indicatorColor="secondary"
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
            centered
          >
            <Tab sx={{fontSize: '24px'}} label="เมนูเพิ่มเติม" {...a11yProps(0)} />
            <Tab sx={{fontSize: '24px'}} label="ตัวเลือก" {...a11yProps(1)} />
          </Tabs>
          <CustomTabPanel value={value} index={0} resetState={value !== 0} setRowsPerPage={setRowsPerPage} setPage={setPage}>
          <AddonSearch onSearch={(searchValue) => handleSearchAddon(searchValue)} />
          <br/>
          <Grid style={{backgroundColor:'#FCF6EE'}} sx={{borderRadius:'20px'}}
            container
            spacing={3}
          >
            {paginatedAddon.map((Addon) => (
              <Grid
                /* xs={12}
                md={6} */
                lg={3}
                key={Addon._id}
              >
                <AddonCard Addon={Addon} />
              </Grid>
            ))}
          </Grid>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center'
            }}
          >
            <TablePagination
              component="div"
              rowsPerPageOptions={[4, 8, 24, { label: "All", value: 1000000 }]}
              count={Addons.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
          />
          </Box>
          </CustomTabPanel>

          <CustomTabPanel value={value} index={1} resetState={value !== 1} setRowsPerPage={setRowsPerPage} setPage={setPage}>
          <OptionSearch onSearch={(searchValue) => handleSearchOption(searchValue)} /> 
          <br/>
          <Grid style={{backgroundColor:'#FCF6EE'}}
            container
            spacing={3}
          >
            {paginatedOptions.map((optionGroup) => (
              <Grid
                /* xs={12}
                md={6} */
                lg={3}
                key={optionGroup._id}
              >
                <OptionCard OptionGroups={optionGroup} />
              </Grid>
            ))}
          </Grid>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center'
            }}
          >
          <TablePagination
            component="div"
            rowsPerPageOptions={[4, 8, 24, { label: "All", value: 1000000 }]}
            count={Addons.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
          </Box>
          </CustomTabPanel>

        </Stack>
      </Container>
    </Box>
  </>
    )
}


Addon.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Addon;
