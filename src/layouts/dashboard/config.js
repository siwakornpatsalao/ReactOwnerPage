import ChartBarIcon from '@heroicons/react/24/solid/ChartBarIcon';
import CogIcon from '@heroicons/react/24/solid/CogIcon';
import LockClosedIcon from '@heroicons/react/24/solid/LockClosedIcon';
import ShoppingBagIcon from '@heroicons/react/24/solid/ShoppingBagIcon';
import UserIcon from '@heroicons/react/24/solid/UserIcon';
import UserPlusIcon from '@heroicons/react/24/solid/UserPlusIcon';
import UsersIcon from '@heroicons/react/24/solid/UsersIcon';
import XCircleIcon from '@heroicons/react/24/solid/XCircleIcon';
import { SvgIcon } from '@mui/material';
import BuildingStorefrontIcon from '@heroicons/react/24/solid/BuildingStorefrontIcon';
import CakeIcon from '@heroicons/react/24/solid/CakeIcon';
import PhotoIcon from '@heroicons/react/24/solid/PhotoIcon';
import DocIcon from '@heroicons/react/24/solid/NewspaperIcon';
import EyeIcon from '@heroicons/react/24/solid/EyeIcon';


export const items = [
  {
    title: 'Overview',
    path: '/',
    icon: (
      <SvgIcon sx={{fontSize: '26px'}} fontSize="small">
        <ChartBarIcon />
      </SvgIcon>
    )
  },
  {
    title: 'Order',
    path: '/order',
    icon: (
      <SvgIcon sx={{fontSize: '26px'}} fontSize="small">
        <EyeIcon />
      </SvgIcon>
    )
  },
  {
    title: 'Menu',
    path: '/menu',
    icon: (
      <SvgIcon sx={{fontSize: '26px'}} fontSize="small">
        <BuildingStorefrontIcon />
      </SvgIcon>
    )
  },
  {
    title: 'Addon',
    path: '/addon',
    icon: (
      <SvgIcon sx={{fontSize: '26px'}} fontSize="small">
        <CakeIcon />
      </SvgIcon>
    )
  },
  {
    title: 'Promotion',
    path: '/promotion',
    icon: (
      <SvgIcon sx={{fontSize: '26px'}} fontSize="small">
        <PhotoIcon />
      </SvgIcon>
    )
  },
  {
    title: 'Report',
    path: '/report',
    icon: (
      <SvgIcon sx={{fontSize: '26px'}} fontSize="small">
        <DocIcon />
      </SvgIcon>
    )
  },
];
