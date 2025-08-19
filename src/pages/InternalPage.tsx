import type { ReactNode } from "react";
import InternalHeader from "../components/InternalHeader";

type InternalPageProps = {
  children: ReactNode;
};

export default function InternalPage({ children }: InternalPageProps) {
  return (
    <>
      <InternalHeader />
      <main className="pt-16 h-[calc(100vh)]">{children}</main>
      {/* <main className="pt-16 h-[calc(100vh-64px)]">{children}</main> */}
    </>
  );
}
