import React from "react";
import { Box, Container, Stack } from "@mui/material";
import { useGlobals } from "../../hooks/useGlobals";

const features = [
  {
    icon: "🚚",
    title: "Free Delivery",
    desc: "Free shipping on all orders over $50",
  },
  {
    icon: "💎",
    title: "Premium Quality",
    desc: "Handpicked materials built to last",
  },
  {
    icon: "↩️",
    title: "Easy Returns",
    desc: "30-day hassle-free return policy",
  },
  {
    icon: "🔒",
    title: "Secure Payment",
    desc: "Your payment info is always safe",
  },
];

export default function WhyChooseUs() {
  const { goldMode } = useGlobals();

  return (
    <div className={`why-choose-frame ${goldMode ? "gold" : ""}`}>
      <Container>
        <Stack className={"why-choose-main"}>
          <Box className={"category-title why-choose-title"}>
            Why Choose Us
          </Box>
          <Stack className={"why-choose-cards"}>
            {features.map((item) => (
              <Box key={item.title} className={"why-choose-card"}>
                <Box className={"why-choose-icon"}>{item.icon}</Box>
                <Box className={"why-choose-card-title"}>{item.title}</Box>
                <Box className={"why-choose-card-desc"}>{item.desc}</Box>
              </Box>
            ))}
          </Stack>
        </Stack>
      </Container>
    </div>
  );
}
