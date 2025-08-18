import { useParams, useNavigate } from "react-router-dom";
import InternalHeader from "../components/InternalHeader";
import { MapPlacement } from "../features/map/MapPlacement";

export default function MapPlacementRoute() {
  const { spaceId = "" } = useParams();
  const navigate = useNavigate();
  return (
    <>
      <InternalHeader />
      <main className="pt-16 h-[calc(100vh-64px)]">
        <MapPlacement
          spaceId={spaceId}
          onNext={() => navigate(`/booking/${spaceId}`)}
        />
      </main>
    </>
  );
}
