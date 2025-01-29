'use client';

import React from "react";
import { ProfileHeader } from "@/components/UserDetails/profile-header";
import { ProfileForm } from "@/components/UserDetails/profile-form";
import { RecentOrders } from "@/components/UserDetails/recent-orders";
import { ViewStatistic } from "@/components/UserDetails/view-statistic";

export default function ProfilePage() {
  return (
    <div className="max-w-6xl mx-auto">
      <ProfileHeader />
      <div
        className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8"
      >
        <div>
          <ProfileForm />
        </div>
        <div>
          <RecentOrders />
        </div>
      </div>
      <div className="mt-8">
        <ViewStatistic />
      </div>
    </div>
  );
}