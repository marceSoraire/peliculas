import * as React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

const Loading = () => {
  return (
    <Box className='flex justify-center mt-8'>
      <CircularProgress className='m-auto' size={50}/>
    </Box>
  );
}
export default Loading;