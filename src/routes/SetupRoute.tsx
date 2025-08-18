import { useNavigate } from "react-router-dom";
import { SpaceSetup } from "../features/admin/SpaceSetup";

import InternalPage from '@/pages/InternalPage';


export default function SetupRoute() {
  const navigate = useNavigate();
  return (
    <InternalPage>
      <SpaceSetup onDone={(sid) => navigate(`/editor/${sid}`)} />
    </InternalPage>
  );
}
