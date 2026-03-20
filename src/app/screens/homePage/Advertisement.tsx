import React from "react";

import { Container } from "@mui/material";


export default function Advertisement(){
       return(
        <div className="ads-seller-frame">
              <video
               className={"ads-video"}
               autoPlay={true} 
               loop
               muted
               playsInline
               data-video-media="">
                  <source type="video/mp4" src="/video/Baginy-ads.m4.mov"/>
               </video>
        </div>
       );
}