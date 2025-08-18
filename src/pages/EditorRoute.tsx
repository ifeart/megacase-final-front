import { useParams, useNavigate } from "react-router-dom";
import InternalHeader from "../components/InternalHeader";
import { EditorView } from "../components/EditorView";

export default function EditorRoute() {
  const { spaceId = "" } = useParams();
  const navigate = useNavigate();
  return (
    <>
      <InternalHeader />
      <main className="pt-16 h-[calc(100vh-64px)]">
        <EditorView
          spaceId={spaceId}
          onNext={() => navigate(`/annotate/${spaceId}`)}
        />
      </main>
    </>
  );
}
