


import { Button } from "@mui/material";
import React from "react";
import logger from "../logger";



export default class ErrorBoundary extends React.Component {

   state = {
      hasError: false,
   }

   componentDidCatch(err) {
      this.setState({ hasError: true });
      logger.error(err);
   }

   render() {

      if (!!this.state.hasError) {
         return <ErrorMessage />
      } else {
         return this.props.children;
      }
   }
   
}

function reload() {
   window.location.reload();
}

function ErrorMessage() {
   return <div className="vh-align fixed h-screen w-screen top-0 left-0 bg-gradient-to-tl from-white to-orange-200"
   >
      <div className="w-[100%] max-w-[400px] p-[20px]">
         <h1 className="text-2xl font-bold my-[0] py-[0]">Something went wrong 😔</h1>
         <p className="text-lg text-gray-600 my-[10px] p-0">
            We have notified the developers!
         </p>

         <Button variant="contained" 
            onClick={reload} 
            // size="large"
            className="bg-orange-600"
         >
            RELOAD
         </Button>
      </div>
   </div>
}