"use client";

import ProfileView from "../ProfileView";
import { useParams } from "next/navigation";

export default function ProfileIdPage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  return <ProfileView userId={id} />;
} 