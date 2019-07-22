import React from "react";

// import BusyIndicator from "react-busy-indicator@1.0.0";

export default function Layout({ children }) {
  // If there is a route that hasn't finished loading, it can be
  // retrieved with `useLoadingRoute()`.
  // let loadingRoute = useLoadingRoute();

  return (
    <div className="App Layout">
      {/* This component shows a loading indicator after a delay */}
      {/* <BusyIndicator isBusy={!!loadingRoute} delayMs={200} /> */}

      <main>{children}</main>
    </div>
  );
}
