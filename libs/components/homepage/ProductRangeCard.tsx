import React from 'react';
import { Stack, Box, Divider, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { Property } from '../../types/property/property';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { REACT_APP_API_URL } from '../../config';
import { useRouter } from 'next/router';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';

import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';

interface TrendPropertyCardProps {
	property: Property;
	likeTargetPropertyHandler: any;
}

const ProductRangeCard = (props: TrendPropertyCardProps) => {
	const { property, likeTargetPropertyHandler } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	const user = useReactiveVar(userVar);

	/** HANDLERS **/
	const pushDetailHandler = async (id: string) => {
		await router.push({ pathname: 'property/detail', query: { id: id } });
	};

	if (device === 'mobile') {
		return (
			<Card sx={{ maxWidth: 345 }}>
				<CardMedia
					component="img"
					alt="green iguana"
					height="140"
					image="/static/images/cards/contemplative-reptile.jpg"
				/>
				<CardContent>
					<Typography gutterBottom variant="h5" component="div">
						Lizard
					</Typography>
					<Typography variant="body2" sx={{ color: 'text.secondary' }}>
						Lizards are a widespread group of squamate reptiles, with over 6,000 species, ranging across all continents
						except Antarctica
					</Typography>
				</CardContent>
				<CardActions>
					<Button size="small">Share</Button>
					<Button size="small">Learn More</Button>
				</CardActions>
			</Card>
		);
	} else {
		return (
			<Card sx={{ maxWidth: 345 }}>
				<CardMedia
					component="img"
					alt="green iguana"
					height="140"
					image="/static/images/cards/contemplative-reptile.jpg"
				/>
				<CardContent>
					<Typography gutterBottom variant="h5" component="div">
						Lizard
					</Typography>
					<Typography variant="body2" sx={{ color: 'text.secondary' }}>
						Lizards are a widespread group of squamate reptiles, with over 6,000 species, ranging across all continents
						except Antarctica
					</Typography>
				</CardContent>
				<CardActions>
					<Button size="small">Share</Button>
					<Button size="small">Learn More</Button>
				</CardActions>
			</Card>
		);
	}
};

export default ProductRangeCard;
