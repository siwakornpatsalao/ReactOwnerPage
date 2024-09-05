import PropTypes from 'prop-types';
import ArrowDownOnSquareIcon from '@heroicons/react/24/solid/ArrowDownOnSquareIcon';
import ClockIcon from '@heroicons/react/24/solid/ClockIcon';
import { Avatar, Box, Card, CardContent, Divider, Stack, SvgIcon, Typography, Button } from '@mui/material';
import Link from 'next/link';

export const AddonCard = (props) => {
  const { Addon } = props;

  function handleEdit(Addon){
    // call edit menu component
  }

  return (
    <Card
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        maxWidth: 350,
        border: '1px solid #ccc', 
      }}
      style={{
        boxShadow: ' 2px 9px #EADDCD',/* #D8E8DC */
      }}
    >
      <CardContent>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <img
            src={Addon.thumbnail}
            variant="square"
            height="200px"
          />
        </Box>

        <Typography
          sx={{
            marginLeft: '10px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            fontSize: '23px',
            marginTop: '10px'
          }}
          align="left"
          gutterBottom
          variant="body1"
          nowrap
        >
          {Addon.name}
        </Typography>
        <Typography
          marginLeft={'10px'}
          align="left"
          variant="body1"
          color="red"
          sx={{fontSize: '20px',}}
        >
          {Addon.price}.-
        </Typography>
      </CardContent>
      <Box sx={{ flexGrow: 1 }} />
      {/* <Divider /> */}
      <Stack
        alignItems="center"
        direction="row"
        justifyContent="space-between"
        spacing={2}
        sx={{ p: 2 }}
      >
        <Stack
          alignItems="center"
          direction="row"
          spacing={1}
        >
          <SvgIcon
            color="action"
            fontSize="small"
          >
            <ClockIcon />
          </SvgIcon>
          <Typography
            color="text.secondary"
            display="inline"
            variant="body2"
          >
            อัพเดต: {new Date(Addon.updated_at).toLocaleDateString('th-TH')}
          </Typography>
        </Stack>
        <Stack
          alignItems="center"
          direction="row"
          spacing={1}
        >

          <Typography
            color="text.secondary"
            display="inline"
            variant="body2"
          >
          <Link href={`/edit/editAddon?id=${Addon._id}`} >
          <Button >แก้ไข</Button>
          </Link>

          </Typography>
        </Stack>
      </Stack>
    </Card>
  );
};

AddonCard.propTypes = {
  Addon: PropTypes.object.isRequired
};
