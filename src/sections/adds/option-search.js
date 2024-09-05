import MagnifyingGlassIcon from '@heroicons/react/24/solid/MagnifyingGlassIcon';
import { Card, InputAdornment, OutlinedInput, SvgIcon } from '@mui/material';
import { useState } from 'react';

export const OptionSearch = ({ onSearch }) => {
  const [searchValue, setSearchValue] = useState('');

  const handleSearch = (value) => {
    setSearchValue(value);
    onSearch(value);
  };

  return(
    <Card sx={{ p: 2 }}>
        <OutlinedInput
          defaultValue=""
          fullWidth
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search Option"
          startAdornment={(
            <InputAdornment position="start">
              <SvgIcon
                color="action"
                fontSize="small"
              >
                <MagnifyingGlassIcon />
              </SvgIcon>
            </InputAdornment>
          )}
          sx={{ maxWidth: 1500 }}
        />
     </Card>
  )
}