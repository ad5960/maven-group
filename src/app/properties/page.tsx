import { redirect } from "next/navigation";

export default function Page() {
  redirect("/properties/page/1");
  return null;
}
