import React from "react";
import { Box, Container, Stack } from "@mui/material";
import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import { retrieveTopUsers } from "./selector";
import { serverApi } from "../../../lib/config";
import { Member } from "../../../lib/types/member";
import { useGlobals } from "../../hooks/useGlobals";

// Redux Selector
const topUsersRetriever = createSelector(
  retrieveTopUsers,
  (topUsers) => ({ topUsers })
);

export default function ActiveUsers() {
  const { topUsers } = useSelector(topUsersRetriever);
  const { goldMode } = useGlobals();

  return (
    <div className={`active-users-frame ${goldMode ? "gold" : ""}`}>
      <Container>
        <Stack className="main">
          <Box className="category-title">Active Users</Box>

          <Stack className="cards-frame" direction="row">
            {topUsers?.length === 0 ? (
              <Box className="no-data">No Active Users!</Box>
            ) : (
              topUsers.map((member: Member) => {
                const imagePath = member.memberImage
                  ? `${serverApi}/${member.memberImage}`
                  : "/icons/default-user.svg";

                return (
                  <div key={member._id} className="user-card">
                    <div className="user-card-top">
                      <div className="user-avatar-ring">
                        <img
                          src={imagePath}
                          alt={member.memberNick}
                          className="user-avatar-img"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "/icons/default-user.svg";
                          }}
                        />
                      </div>
                      <span className="user-active-dot" />
                    </div>
                    <div className="user-card-body">
                      <span className="user-name">{member.memberNick}</span>
                      <span className="user-type-badge">{member.memberType}</span>
                      <span className="user-points">
                        {member.memberPoints ?? 0} pts
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </Stack>
        </Stack>
      </Container>
    </div>
  );
}
