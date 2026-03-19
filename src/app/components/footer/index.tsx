import React from "react";
import { Box, Container, Stack } from "@mui/material";
import { Link } from "react-router-dom";
import styled from "styled-components";

const Footers = styled.div`
  width: 100%;
  height: auto;
  display: flex;
  background: #EBEBEB;
  padding: 64px 0 40px;
`;

export default function Footer() {
  return (
    <Footers>
      <Container>

        {/* Logo — centered */}
        <Stack alignItems={"center"} sx={{ mb: "56px" }}>
          <Box className={"footer-logo-text"}>Velmora</Box>
        </Stack>

        {/* 4-column grid — centered */}
        <Stack flexDirection={"row"} justifyContent={"center"} gap={"80px"} sx={{ mb: "56px" }}>

          <Stack className={"foot-col"}>
            <Box className={"foot-category-title"}>Explore</Box>
            <Box className={"foot-category-link"}>
              <Link to="/">Home</Link>
              <Link to="/products">Products</Link>
            </Box>
          </Stack>

          <Stack className={"foot-col"}>
            <Box className={"foot-category-title"}>Support</Box>
            <Box className={"foot-category-link"}>
              <Link to="/help">FAQ</Link>
              <Link to="/help">Contact</Link>
            </Box>
          </Stack>

          <Stack className={"foot-col"}>
            <Box className={"foot-category-title"}>Others</Box>
            <Box className={"foot-category-link"}>
              <Link to="/orders">Orders</Link>
              <Link to="/member-page">My Page</Link>
            </Box>
          </Stack>

          <Stack className={"foot-col"}>
            <Box className={"foot-category-title"}>Utility</Box>
            <Box className={"foot-category-link"}>
              <Link to="/help">Instruction</Link>
              <Link to="/help">License</Link>
            </Box>
          </Stack>

        </Stack>

        {/* Social icons — centered */}
        <Stack alignItems={"center"} sx={{ mb: "48px" }}>
          <Box className={"sns-context"}>
            <img src={"/icons/twitter.svg"} alt="Twitter" />
            <img src={"/icons/facebook.svg"} alt="Facebook" />
            <img src={"/icons/instagram.svg"} alt="Instagram" />
            <img src={"/icons/youtube.svg"} alt="YouTube" />
          </Box>
        </Stack>

        {/* Divider */}
        <Stack style={{ border: "1px solid #D8D8D8", width: "100%" }} />

        {/* Bottom links row */}
        <Stack alignItems={"center"} sx={{ mt: "20px", mb: "8px" }}>
          <Box className={"footer-bottom-links"}>
            <Link to="/help">License</Link>
            <span className={"footer-sep"}>|</span>
            <Link to="/products">Style Guide</Link>
            <span className={"footer-sep"}>|</span>
            <Link to="/">Customize</Link>
          </Box>
        </Stack>

        {/* Copyright */}
        <Stack alignItems={"center"}>
          <Box className={"copyright-txt"}>
            Copyright © Velmora. All rights reserved.
          </Box>
        </Stack>

      </Container>
    </Footers>
  );
}
