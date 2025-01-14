import { useSession } from "gabber-client-react"
import React, { useEffect } from "react";
import { useSettings } from "./SettingsProvider";

export function TranscriptionRenderer() {
    const { transcription } = useSession();
    const {settings} = useSettings(); 

    useEffect(() =>{
      console.log(transcription)
    }, [transcription])

    return (
      <div className="h-full w-full">
        <div
          style={{
            color: settings.baseColorContent,
          }}
        >
          {transcription.text}
          {transcription.final ? "" : "..."}
        </div>
      </div>
    );
}