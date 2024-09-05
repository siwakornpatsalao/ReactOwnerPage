import PropTypes from 'prop-types';
import BellIcon from '@heroicons/react/24/solid/BellIcon';
import UsersIcon from '@heroicons/react/24/solid/UsersIcon';
import Bars3Icon from '@heroicons/react/24/solid/Bars3Icon';
import MagnifyingGlassIcon from '@heroicons/react/24/solid/MagnifyingGlassIcon';
import {
  Avatar,
  Badge,
  Box,
  IconButton,
  Stack,
  SvgIcon,
  Tooltip,
  useMediaQuery
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { usePopover } from 'src/hooks/use-popover';
import { AccountPopover } from './account-popover';
import { useEffect , useState, useRef} from 'react';
import { useRouter } from 'next/navigation';

const SIDE_NAV_WIDTH = 280;
const TOP_NAV_HEIGHT = 80;

export const TopNav = (props) => {
  const { onNavOpen } = props;
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'));
  const accountPopover = usePopover();
  const initial = useRef(false);
  const [count,setCount] = useState(0);
  const router = useRouter();

  function handleOrderPage(){
    router.push('/order')
  }

  useEffect(() => {
    async function fetchData(url) {
      try {
        const res = await fetch(url);
        const data = await res.json();
        setCount((prevCount) => prevCount + data.length);
        console.log(data);
      } catch (error) {
        console.error(`Error fetching data from ${url}:`, error);
      }
    }
  
      if (!initial.current) {
        initial.current = true;
        console.log(initial.current);
        fetchData("http://localhost:5000/orders");
        fetchData('http://localhost:5000/orderPaids');
      }
      
    }, []);

  return (
    <>
      <Box
        component="header"
        sx={{
          backdropFilter: 'blur(6px)',
          background: "linear-gradient(90deg,  #FEFFB8, 70%, #EBA03E);",
          /* background: "linear-gradient(90deg,  #CDFFD8, 70%, #94B9FF);", */
          position: 'sticky',
          left: {
            lg: `${SIDE_NAV_WIDTH}px`
          },
          top: 0,
          width: {
            lg: `calc(100% - ${SIDE_NAV_WIDTH}px)`
          },
          zIndex: (theme) => theme.zIndex.appBar
        }}
      >
        <Stack
          alignItems="center"
          direction="row"
          justifyContent="space-between"
          spacing={2}
          sx={{
            minHeight: TOP_NAV_HEIGHT,
            px: 2
          }}
        >
          <Stack
            alignItems="center"
            direction="row"
            spacing={2}
          >
            {!lgUp && (
              <IconButton onClick={onNavOpen}>
                <SvgIcon sx={{fontSize: '32px'}} fontSize="small">
                  <Bars3Icon />
                </SvgIcon>
              </IconButton>
            )}
            {/* <Tooltip title="Search">
              <IconButton>
                <SvgIcon fontSize="small">
                  <MagnifyingGlassIcon />
                </SvgIcon>
              </IconButton>
            </Tooltip> */}
          </Stack>
          <Stack
            alignItems="center"
            direction="row"
            spacing={2}
          >
            {/* <Tooltip title="Contacts">
              <IconButton>
                <SvgIcon fontSize="small">
                  <UsersIcon />
                </SvgIcon>
              </IconButton>
            </Tooltip> */}

            <Tooltip title="แจ้งเตือนรายการอาหาร">
      <IconButton onClick={handleOrderPage}>
        <Badge
          badgeContent={count}
          color="success"
        >
          <SvgIcon sx={{fontSize: '32px'}} fontSize="small">
            <BellIcon />
          </SvgIcon>
        </Badge>
      </IconButton>
    </Tooltip>
    {/* <Avatar
      onClick={accountPopover.handleOpen}
      ref={accountPopover.anchorRef}
      sx={{
         cursor: 'pointer',
         height: 40,
         width: 40
         }}
        src="/assets/avatars/avatar-anika-visser.png"
         /> */}
      <SvgIcon 
        onClick={accountPopover.handleOpen}
        ref={accountPopover.anchorRef} 
        sx={{cursor: 'pointer',fontSize: '32px'}}
        ontSize="small">
          <UsersIcon />
      </SvgIcon>
          </Stack>
        </Stack>
      </Box>
      <AccountPopover
        anchorEl={accountPopover.anchorRef.current}
        open={accountPopover.open}
        onClose={accountPopover.handleClose}
      />
    </>
  );
};

TopNav.propTypes = {
  onNavOpen: PropTypes.func
};
