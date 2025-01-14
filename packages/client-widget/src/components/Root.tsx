import { useEffect, useMemo, useRef, useState } from "react";
import { Settings } from "..";
import { SessionProvider, useSession } from "gabber-client-react";
import React from "react";
import { MainView } from "./MainView";
import { Gabber } from "gabber-client-core";
import { SettingsProvider, useSettings } from "./SettingsProvider";
import { BottomBarView } from "./BottomBarView";
import { Toaster } from "react-hot-toast";
import { InternalWidget } from "../InternalWidget";

const DEFAULT_SETTINGS: Settings = {
  layout: "full"
};

type Props = {
  connectionDetails: Gabber.ConnectionDetails;
  settings?: Settings;
  widget: InternalWidget;
};

export function Root({ connectionDetails, settings, widget }: Props) {
  const [shouldConnect, setShouldConnect] = useState(
    Boolean(settings?.autoConnect)
  );

  const [forceDisconnect, setForceDisconnect] = useState(false)

  const disconnectHandler = useRef(() => {
    setForceDisconnect(true)
  })

  useEffect(() => {
    widget.registerDisconnectHandler(disconnectHandler.current);
  }, [])

  const component = useMemo(() => {
    if(settings?.layout === "full") {
      return <MainView />
    } else if(settings?.layout === "bottom_bar") {
      return <BottomBarView />
    }
    return <BottomBarView />;
  }, [])

  return (
    <SessionProvider
      connectionDetails={connectionDetails}
      connect={shouldConnect && !forceDisconnect}
    >
      <Toaster />
      <SettingsProvider
        connect={() => setShouldConnect(true)}
        settings={settings || DEFAULT_SETTINGS}
        widget={widget}
      >
        <CallbackSync />
        {component}
      </SettingsProvider>
    </SessionProvider>
  );
}

function CallbackSync() {
  const {
    agentState,
    remainingSeconds,
    connectionState
  } = useSession();

  const { widget } = useSettings();

  useEffect(() => {
    widget.connectionState = connectionState;
  }, [connectionState, widget])

  useEffect(() => {
    widget.agentState = agentState;
  }, [agentState, widget])

  useEffect(() => {
    widget.remainingSeconds = remainingSeconds
  }, [remainingSeconds, widget])
  
  return null;
}