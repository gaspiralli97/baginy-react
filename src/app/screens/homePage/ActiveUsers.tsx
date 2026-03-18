import React from "react";
import { Box, Container, Stack } from "@mui/material";
import { CssVarsProvider, Typography } from "@mui/joy";
import Card from "@mui/joy/Card";
import CardOverflow from "@mui/joy/CardOverflow";
import AspectRatio from "@mui/joy/AspectRatio";

import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import { retrieveTopUsers } from "./selector";
import { serverApi } from "../../../lib/config";
import { Member } from "../../../lib/types/member";

// Redux Selector
const topUsersRetriever = createSelector(
  retrieveTopUsers,
  (topUsers) => ({ topUsers })
);

export default function ActiveUsers() {
  const { topUsers } = useSelector(topUsersRetriever);

  return (
    <div className={"active-users-frame"}>
      <Container>
        <Stack className="main">
          <Box className="category-title">Active Users</Box>

          <Stack className="cards-frame" direction="row">
            <CssVarsProvider>
              {topUsers?.length === 0 ? (
                <Box className="no-data">No Active Users!</Box>
              ) : (
                topUsers.map((member: Member) => {
                  const imagePath = `${serverApi}/${member.memberImage}`;

                  return (
                    <Card key={member._id} variant="outlined" className="user-card">
                      <CardOverflow>
                        <AspectRatio ratio={1}>
                          <img
                            src={imagePath}
                            alt={member.memberNick}
                          />
                        </AspectRatio>
                      </CardOverflow>

                      <Typography className="user-name">
                        {member.memberNick}
                      </Typography>
                    </Card>
                  );
                })
              )}
            </CssVarsProvider>
          </Stack>
        </Stack>
      </Container>
    </div>
  );
}