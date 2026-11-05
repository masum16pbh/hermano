import { Suspense } from "react";
import AddEventForm from "./addEventForm";


export default function CreatePage() {
  return (
    <Suspense><AddEventForm></AddEventForm></Suspense>
  )
}
