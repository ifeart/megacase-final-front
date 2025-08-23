import { useNavigate, useParams } from "react-router-dom";
import { ReviewEditor } from "../features/review/ReviewEditor";

import InternalPage from "@/pages/InternalPage";

export default function ReviewRoute() {
  const { spaceId = "" } = useParams();
  const navigate = useNavigate();
  return (
    <InternalPage padding={true}>
      <ReviewEditor
        spaceId={spaceId}
        onNext={() => navigate(`/map-placement/${spaceId}`)}
      />
    </InternalPage>
  );
}
