import { useParams, useNavigate } from "react-router-dom";
import InternalHeader from "../components/InternalHeader";
import { AnnotateMarkers } from "../features/admin/AnnotateMarkers";

export default function AnnotateRoute() {
  const { spaceId = "" } = useParams();
  const navigate = useNavigate();
  return (
    <>
      <InternalHeader />
      <main className="pt-16 h-[calc(100vh-64px)]">
        <AnnotateMarkers
          spaceId={spaceId}
          onNext={() => navigate(`/review/${spaceId}`)}
        />
      </main>
    </>
  );
}
