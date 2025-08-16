import UserAddressCard from "@/components/user-profile/UserAddressCard";
import UserInfoCard from "@/components/user-profile/UserInfoCard";
import UserMetaCard from "@/components/user-profile/UserMetaCard";
import { getCurrentUser } from "@/server/users";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Profil | Machine Care",
  description: "Page de profil de Machine Care",
};

export default async function Profile() {
  const user = await getCurrentUser();

  if (!user) {
    return <div>Utilisateur non trouvé</div>;
  }

  const { currentUser, session } = user;

  return (
    <div>
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
          Profil
        </h3>
        <div className="space-y-6">
          <UserMetaCard user={currentUser} />
          <UserInfoCard user={currentUser} />
          <UserAddressCard user={currentUser} />
        </div>
      </div>
    </div>
  );
}
