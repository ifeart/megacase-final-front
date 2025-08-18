import { useParams } from "react-router-dom";
import InternalHeader from "../components/InternalHeader";
import { BookingView } from "../features/booking/BookingView";

export default function BookingRoute() {
  const { spaceId } = useParams();
  return (
    <>
      <InternalHeader />
      <main className="pt-16 h-[calc(100vh-64px)]">
        <BookingView spaceId={spaceId} />
      </main>
    </>
  );
}
