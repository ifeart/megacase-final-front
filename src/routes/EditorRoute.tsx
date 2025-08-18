import { useNavigate, useParams } from 'react-router-dom'
import { EditorView } from '../components/EditorView'

import InternalPage from '@/pages/InternalPage'

export default function EditorRoute() {
	const { spaceId = '' } = useParams()
	const navigate = useNavigate()
	return (
		<InternalPage>
			<EditorView
				spaceId={spaceId}
				onNext={() => navigate(`/annotate/${spaceId}`)}
			/>
		</InternalPage>
	)
}
