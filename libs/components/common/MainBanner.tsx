import React, { useRef } from 'react';
import { Box, Button, Stack, Typography } from '@mui/material';

export default function MainBanner() {
	return (
		<Stack
			style={{ marginTop: '120px', width: '100%', height: '480px', justifyContent: 'flex-start', alignItems: 'center' }}
		>
			<Typography variant="h1" color="white" sx={{ fontSize: '4.5rem', mt: 4 }}>
				Creative Looks Begin Here
			</Typography>
			<Typography variant="h2" color="white" sx={{ mt: 4, width: '600px', textAlign: 'center' }}>
				New chapter, same you. Score deals on tees, stickers & more, all with fresh art you’ll love.
			</Typography>
			<Button
				variant="contained"
				color="secondary"
				size="large"
				sx={{
					mt: 4,
					width: '200px',
					height: '60px',
					textAlign: 'center',
					backgroundColor: 'white',
					borderRadius: '10px',
				}}
			>
				<Typography variant="h3">Shop Now</Typography>
			</Button>
		</Stack>
	);
}
