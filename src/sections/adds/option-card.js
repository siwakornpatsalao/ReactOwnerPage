import PropTypes from 'prop-types';
import ArrowDownOnSquareIcon from '@heroicons/react/24/solid/ArrowDownOnSquareIcon';
import ClockIcon from '@heroicons/react/24/solid/ClockIcon';
import { Avatar, Box, Card, CardContent, Divider, Stack, SvgIcon, Typography, Button } from '@mui/material';
import Link from 'next/link';

export const OptionCard = (props) => {
  const { OptionGroups } = props;

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
        <Typography
          sx={{
            marginLeft: '10px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            fontSize: '30px',
            marginTop: '10px'
          }}

        >
          {OptionGroups.name}
        </Typography>
        <Typography
            marginLeft={'10px'}
            align="left"
            variant="body1"
            color="grey"
            sx={{fontSize: '20px',}}
          >
            Options:<br/> {OptionGroups.options.slice(0,4).map((option) => (
            <span key={option._id} style={{ display: 'flex', justifyContent: 'space-between'}}>
            <span>{option.name}</span>
            <span>+{option.price}.-</span>
            </span>
          ))}
            {OptionGroups.options.length > 4 && (
            <span style={{ marginLeft: '10px' }}>...</span>
            )}
          </Typography>
      </CardContent>
      <Box sx={{ flexGrow: 1 }} />
      <Divider />
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
            อัพเดต: {new Date(OptionGroups.updated_at).toLocaleDateString('th-TH')}
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
            <Link href={`/edit/editAddon?id=${OptionGroups._id}`} >
            <Button>แก้ไข</Button>
            </Link>

          </Typography>
        </Stack>
      </Stack>
    </Card>
  );
};

OptionCard.propTypes = {
  OptionGroups: PropTypes.object.isRequired
};
