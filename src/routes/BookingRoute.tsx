import { useParams } from 'react-router-dom'
import { BookingView } from '../features/booking/BookingView'

import InternalPage from '@/pages/InternalPage'

export default function BookingRoute() {
	const { spaceId } = useParams()
	return (
		<InternalPage>
			<BookingView spaceId={spaceId} />
		</InternalPage>
	)
}
