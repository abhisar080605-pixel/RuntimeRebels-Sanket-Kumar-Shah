import React, { useState } from "react";
import { C, seedIssues, seedVisitors, seedNotices, residents } from "./theme";
import RoleSelect from "./components/RoleSelect";
import ResidentView from "./components/ResidentView";
import WardenView from "./components/WardenView";
import SecurityView from "./components/SecurityView";

const ROLES = {
  RESIDENT: "resident",
  WARDEN: "warden",
  SECURITY: "security",
};

export default function App() {
  const [role, setRole] = useState(null);
  const [user] = useState(residents[0]);
  const [issues, setIssues] = useState(seedIssues);
  const [visitors, setVisitors] = useState(seedVisitors);
  const [notices, setNotices] = useState(seedNotices);

  const handleLogout = () => {
    setRole(null);
  };

  if (!role) {
    return <RoleSelect onPick={setRole} />;
  }

  return (
    <div
      className="min-h-screen font-sans"
      style={{ backgroundColor: C.bg }}
    >
      {role === ROLES.RESIDENT && (
        <ResidentView
          user={user}
          onLogout={handleLogout}
          issues={issues}
          setIssues={setIssues}
          visitors={visitors}
          setVisitors={setVisitors}
          notices={notices.filter(
            notice =>
              notice.audience === "all" ||
              notice.audience === "resident"
          )}
        />
      )}

      {role === ROLES.WARDEN && (
        <WardenView
          onLogout={handleLogout}
          issues={issues}
          setIssues={setIssues}
          visitors={visitors}
          setVisitors={setVisitors}
          notices={notices}
          setNotices={setNotices}
        />
      )}

      {role === ROLES.SECURITY && (
        <SecurityView
          onLogout={handleLogout}
          visitors={visitors}
          setVisitors={setVisitors}
          notices={notices}
        />
      )}
    </div>
  );
}
