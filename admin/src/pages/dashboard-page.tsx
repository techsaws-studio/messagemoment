import React from "react";

import MessageMomentStatsCards from "@/components/roots/dashboard/messagemoment-stats-cards";
import RealTimeMonitoringMapCard from "@/components/roots/dashboard/real-time-monitoring-map-card";
import RealTimeSessionMonitoringCard from "@/components/roots/dashboard/real-time-session-monitoring-card";
import UsersAvgChatRoomCard from "@/components/roots/dashboard/users-avg-chat-room-card";
import ReturnedVisitorsCard from "@/components/roots/dashboard/returned-visitors-card";

const DashboardPage = () => {
  return (
    <main className="page-layout-standard section-margin-standard">
      {/* MESSAGEMOMENT STATS CARDS */}
      <MessageMomentStatsCards />

      {/* REAL TIME MONITORING MAP CARD */}
      <RealTimeMonitoringMapCard />

      {/* REAL TIME SESSION MONITORING CARD */}
      <RealTimeSessionMonitoringCard />

      <div className="w-full grid md:grid-cols-2 grid-cols-1 md:gap-4 gap-8">
        {/* USERS AVERAGE CHAT ROOM CARD */}
        <UsersAvgChatRoomCard />

        {/* RETURNED VISITORS CARD */}
        <ReturnedVisitorsCard />
      </div>
    </main>
  );
};

export default DashboardPage;
