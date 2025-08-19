import { useNavigate, useParams } from "react-router-dom";
import { MapPlacement } from "../features/map/MapPlacement";
import InternalPage from "@/pages/InternalPage";

export default function MapPlacementRoute() {
  const { officeNameId = "" } = useParams();
  const navigate = useNavigate();

  return (
    <InternalPage>
      <MapPlacement
        officeNameId={officeNameId}
        onNext={() => navigate(`/booking/${officeNameId}`)}
      />
    </InternalPage>
  );
}
