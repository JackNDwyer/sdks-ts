import { createContext, useRef, useEffect, useCallback, useState } from 'react'
import { Gabber } from 'gabber-client-core'
import React = require('react')

type SessionContextData = {
    sessionState: Gabber.SessionState
    messages: Gabber.SessionMessage[]
    microphoneEnabled: boolean
    setMicrophoneEnabled: (enabled: boolean) => Promise<void>
}

const SessionContext = createContext<SessionContextData | undefined>(undefined)

type Props = {
    url: string | undefined 
    token: string | undefined
    connect: boolean
    children: React.ReactNode
}

export function SessionProvider({ token, url, connect, children }: Props) {
    const session = useRef<Gabber.Session | null>(null)
    const [sessionState, setSessionState] = useState<Gabber.SessionState>("not_connected")
    const [messages, setMessages] = useState<Gabber.SessionMessage[]>([])
    const [microphoneEnabledState, setMicrophoneEnabledState] = useState(false);

    const onSessionStateChanged = useCallback((sessionState: Gabber.SessionState) => { 
        setSessionState(sessionState);
    }, [])

    const onMessagesChanged = useCallback((messages: Gabber.SessionMessage[]) => {
        setMessages([...messages])
    }, [])

    const setMicrophoneEnabled = useCallback(async (enabled: boolean) => {
        if(!session.current) {
            console.error("Trying to set microphone when there is no session")
            return
        }
        await session.current.setMicrophoneEnabled(enabled);
    }, [])

    const onMicrophoneChanged = useCallback(async (enabled: boolean) => {
        setMicrophoneEnabledState(enabled);
    }, [])

    useEffect(() => {
        if(connect) {
            if(!token || !url) {
                console.error("Trying to connect without a token or url")
                return
            }
            if(session.current) {
                return
            }
            session.current = new Gabber.Session({ url, token, onSessionStateChanged, onMessagesChanged })
            session.current.connect()
        } else {
            if(!session.current) {
                console.error("Trying to disconnect from no session")
                return
            }
            session.current.disconnect().then(() => session.current = null)
        }
    }, [connect, onMessagesChanged, onSessionStateChanged, token, url])

    return <SessionContext.Provider value={{
        messages,
        sessionState,
        microphoneEnabled: microphoneEnabledState,
        setMicrophoneEnabled,
    }}>
        { children }
    </SessionContext.Provider>
}

export function useSession() {

}