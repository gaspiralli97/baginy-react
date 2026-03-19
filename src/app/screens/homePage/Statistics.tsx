import React from "react";

import { Box, Container, Stack } from "@mui/material";
import Divider from "../../components/divider";


export default function Statistics(){
    return(
        <div className={"static-frame"}>
            <Container>
                <Stack className="info">
                    <Stack className="static-box">
                        <Box className="static-num">20 +</Box>
                        <Box className="static-text">Collections</Box>
                    </Stack>
                    <Divider height="64" width="2" bg="#E3C08D"/>
                    <Stack className="static-box">
                        <Box className="static-num">200</Box>
                        <Box className="static-text">Products</Box>
                    </Stack>
                    <Divider height="64" width="2" bg="#E3C08D"/>

                    <Stack className="static-box">
                        <Box className="static-num">5K</Box>
                        <Box className="static-text">Customers</Box>
                    </Stack>
                    <Divider height="64" width="2" bg="#E3C08D"/>

                    <Stack className="static-box">
                        <Box className="static-num">4.9</Box>
                        <Box className="static-text">Rating</Box>
                    </Stack>
                    
                </Stack>
            </Container>
        </div>
    );
}