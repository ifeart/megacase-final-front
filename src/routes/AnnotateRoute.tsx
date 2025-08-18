import { useNavigate, useParams } from 'react-router-dom'
import { AnnotateMarkers } from '../features/admin/AnnotateMarkers'

import InternalPage from '@/pages/InternalPage'

export default function AnnotateRoute() {
	const { spaceId = '' } = useParams()
	const navigate = useNavigate()
	return (
		<InternalPage>
			<AnnotateMarkers
				spaceId={spaceId}
				onNext={() => navigate(`/review/${spaceId}`)}
			/>
		</InternalPage>
	)
}
