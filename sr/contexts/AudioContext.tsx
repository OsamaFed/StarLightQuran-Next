'use client';

import React, { createContext, useContext, useState } from 'react';

interface AudioContextType {
  currentAudioId: string | null;
  setCurrentAudioId: (id: string | null) => void;
  stopAllAudio: () => void;
  currentAudioRef: React.RefObject<HTMLAudioElement> | null;
  registerAudio: (id: string, ref: any) => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [currentAudioId, setCurrentAudioId] = useState<string | null>(null);
  const [audioRefs, setAudioRefs] = useState<Map<string, any>>(new Map());

  const stopAllAudio = () => {
    audioRefs.forEach((ref) => {
      if (ref?.current) {
        ref.current.pause();
        ref.current.currentTime = 0;
      }
    });
  };

  const registerAudio = (id: string, ref: any) => {
    setAudioRefs((prev) => new Map(prev).set(id, ref));
  };

  const currentAudioRef = currentAudioId ? audioRefs.get(currentAudioId) || null : null;

  return (
    <AudioContext.Provider
      value={{
        currentAudioId,
        setCurrentAudioId,
        stopAllAudio,
        currentAudioRef,
        registerAudio,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within AudioProvider');
  }
  return context;
}
