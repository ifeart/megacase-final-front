import { useNavigate, useParams } from 'react-router-dom'
import { MapPlacement } from '../features/map/MapPlacement'

import InternalPage from '@/pages/InternalPage'

export default function MapPlacementRoute() {
	const { spaceId = '' } = useParams()
	const navigate = useNavigate()
	return (
		<InternalPage>
			<MapPlacement
				spaceId={spaceId}
				onNext={() => navigate(`/booking/${spaceId}`)}
			/>
		</InternalPage>
	)
}
