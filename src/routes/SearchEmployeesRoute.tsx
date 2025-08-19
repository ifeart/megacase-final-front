import InternalPage from '@/pages/InternalPage'
import { SearchEmployees } from '@/features/searching/SearchEmployees'


export default function SearchEmployeesRoute() {

	return (
		<InternalPage>
			<SearchEmployees />
		</InternalPage>
	)
}
