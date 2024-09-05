import PropTypes, { func } from 'prop-types';
import ArrowDownOnSquareIcon from '@heroicons/react/24/solid/ArrowDownOnSquareIcon';
import ClockIcon from '@heroicons/react/24/solid/ClockIcon';
import { Avatar, Box, Button, Card, CardContent, Divider, Stack, SvgIcon, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Link from 'next/link';

export const PromotionCard = (props) => {
  const { Promotion} = props;

  return (
    <Card
      sx={{
        display: 'flex',
        flexDirection: 'column',
      }}
      style={{
        boxShadow: ' 2px 9px #EADDCD'
      }}
    >
      <div>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <img
                  style={{
                    width: "100%",
                    height: "auto",
                  }}
                  src={Promotion.image}
                  alt="Preview"
                  variant="square"
                  width="600px"/>
          {/* <img
            src={Promotion.image}
            variant="square"
            style={{ width: '100%', height: '250px' }}
          /> */}
        </Box>
      </div>
      <Box sx={{ flexGrow: 1 }} />
      <Divider />
      <Stack
        alignItems="center"
        direction="row"
        justifyContent="space-between"
        spacing={2}

      >
        <Stack
          alignItems="center"
          direction="row"
          spacing={1}
        >
          <SvgIcon
            style={{marginLeft:'10px'}}
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
            อัพเดต: {new Date(Promotion.updated_at).toLocaleDateString('th-TH')}
          </Typography>
        </Stack>
        <Stack
          alignItems="center"
          direction="row"
          spacing={1}
        >
          <Link href={`/edit/editPromotion?id=${Promotion._id}`} >
        <Button>แก้ไข</Button>
        </Link>
          <Typography
            color="text.secondary"
            display="inline"
            variant="body2"
          >

          </Typography>
        </Stack>
      </Stack>
    </Card>
  );
};

PromotionCard.propTypes = {
  Promotion: PropTypes.object.isRequired
};