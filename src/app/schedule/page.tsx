import React from "react";
import ScheduleClient from "./ScheduleClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "График работы | SOUZ",
  description: "График работы филиалов и сотрудников",
};

export default function SchedulePage() {
  return <ScheduleClient />;
}
