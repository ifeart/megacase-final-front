import { useParams, useNavigate } from "react-router-dom";
import InternalHeader from "../components/InternalHeader";
import { ReviewEditor } from "../features/review/ReviewEditor";

export default function ReviewRoute() {
  const { spaceId = "" } = useParams();
  const navigate = useNavigate();
  return (
    <>
      <InternalHeader />
      <main className="pt-16 h-[calc(100vh-64px)]">
        <ReviewEditor
          spaceId={spaceId}
          onNext={() => navigate(`/map-placement/${spaceId}`)}
        />
      </main>
    </>
  );
}
