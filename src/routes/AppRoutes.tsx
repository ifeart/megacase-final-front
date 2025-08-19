import { Navigate, Route, Routes } from 'react-router-dom'
import {AnnotateRoute, BookingRoute, EditorRoute, MapPlacementRoute, ReviewRoute, SetupRoute, SearchEmployeesRoute} from '@/routes'


export function AppRoutes() {
	return (
		<Routes>
			<Route path='/setup' element={<SetupRoute />} />
			<Route path='/editor/:spaceId' element={<EditorRoute />} />
			<Route path='/annotate/:spaceId' element={<AnnotateRoute />} />
			<Route path='/review/:spaceId' element={<ReviewRoute />} />
			<Route path='/map-placement/:spaceId' element={<MapPlacementRoute />} />
			<Route path='/booking/:spaceId?' element={<BookingRoute />} />
			<Route path='/search/employees' element={<SearchEmployeesRoute />} />
			<Route path='/*' element={<Navigate to='/booking' />} />
		</Routes>
	)
}
