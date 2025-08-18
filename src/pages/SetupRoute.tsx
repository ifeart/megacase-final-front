import { useNavigate } from "react-router-dom";
import InternalHeader from "../components/InternalHeader";
import { SpaceSetup } from "../features/admin/SpaceSetup";

export default function SetupRoute() {
  const navigate = useNavigate();
  return (
    <>
      <InternalHeader />
      <main className="pt-16 h-[calc(100vh-64px)]">
        <SpaceSetup onDone={(sid) => navigate(`/editor/${sid}`)} />
      </main>
    </>
  );
}
