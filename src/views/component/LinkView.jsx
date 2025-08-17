import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import YouTubeIcon from '@mui/icons-material/YouTube';
import EmailIcon from '@mui/icons-material/Email';

const LinkView = ({ link, type }) => {
  let icon = null;

  switch (type) {
    case 'instagram':
      icon = <InstagramIcon sx={{ mr: 1, color: '#E1306C' }} />;
      break;
    case 'facebook':
      icon = <FacebookIcon sx={{ mr: 1, color: '#1877F3' }} />;
      break;
    case 'twitter':
      icon = <TwitterIcon sx={{ mr: 1, color: '#1DA1F2' }} />;
      break;
    case 'linkedin':
      icon = <LinkedInIcon sx={{ mr: 1, color: '#0077B5' }} />;
      break;
    case 'youtube':
      icon = <YouTubeIcon sx={{ mr: 1, color: '#FF0000' }} />;
      break;
    case 'email':
      icon = <EmailIcon sx={{ mr: 1, color: '#EA4335' }} />;
      break;
    default:
      icon = null;
  }

  return (
    <Box display="flex" alignItems="center" mb={1}>
      {icon}
      <Typography>{link}</Typography>
    </Box>
  );
};

export default LinkView;