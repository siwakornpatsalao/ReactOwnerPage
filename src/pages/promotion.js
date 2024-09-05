import Head from 'next/head';
import PlusIcon from '@heroicons/react/24/solid/PlusIcon';
import Swal from "sweetalert2";
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
import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';
import { PromotionCard } from 'src/sections/promotion/promotion-card';
import { PromotionSearch } from 'src/sections/promotion/promotion-search';
import TablePagination from '@mui/material/TablePagination';


export default function Promotion(){

  const [promotions, setPromotions] = useState([]);
  const initial = useRef(false);
  const [originalPromotions, setOriginalPromotions] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const [paginatedPromotion, setPaginatedPromotion] = useState(promotions);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  /* const handleSearchPromotion = (searchValue) => {
    if (searchValue !== '') {
      const filteredPromotion = originalPromotions.filter((promotion) =>
        promotion.topic.toLowerCase().includes(searchValue.toLowerCase())
      );
      setPromotions(filteredPromotion);
    } else {
      setPromotions(originalPromotions)
    }
  }; */

  useEffect(() => {
    async function fetchPromotion(){
      try{
        const res = await fetch("http://localhost:5000/promotions");
        const data = await res.json();
        setPromotions(data);
        setOriginalPromotions(data);
        console.log(data);
      }catch(error) {
        console.error("Error fetching Promotion:", error);
      }
    }

    if (!initial.current) {
      initial.current = true;
      console.log(initial.current);
      fetchPromotion();
    }
  }, [])

  useEffect(() => {
    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    setPaginatedPromotion(promotions.slice(startIndex, endIndex));
  }, [promotions, page, rowsPerPage]);

    return(
        <>
    <Head>
      <title>
        Promotion | Devias Kit
      </title>
    </Head>
    <Box
      component="main"
      /* sx={{ backgroundColor: '#EEF8F7'}} */
    >
      <Container maxWidth="xl" sx={{marginTop: '40px'}}>
        <Stack spacing={3}>
          <Stack
            direction="row"
            justifyContent="space-between"
            spacing={4}
          >
            <Stack spacing={1}>
              <Typography style={{marginLeft: '5px', marginTop: '7px'}} variant="h4">
                Promotion
              </Typography>
            </Stack>
            <div>
                <Link href="./add/addPromotion">
              <Button
                startIcon={(
                  <SvgIcon fontSize="small">
                    <PlusIcon />
                  </SvgIcon>
                )}
                variant="contained"
                sx={{fontSize:'20px'}}
              >
                เพิ่มโปรโมชั่น
              </Button>
              </Link>
            </div>
           </Stack>
        </Stack>
        <br/>
          <Grid
            container
            spacing={3}>
            {paginatedPromotion.map((promotion) => (
              <Grid
                xs={12}
                md={6}
                lg={12}
                key={promotion._id}
              >
              <PromotionCard Promotion={promotion} />
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
                count={promotions.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
          </Box>
      </Container>
    </Box>
  </>)
}

Promotion.getLayout = (page) => (
    <DashboardLayout>
      {page}
    </DashboardLayout>
);