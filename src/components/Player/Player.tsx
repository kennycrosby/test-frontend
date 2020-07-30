import React, { useState } from 'react';
import './Player.scss';
import ReactAudioPlayer from 'react-audio-player';
import { Sentence } from '../Sentence';

import transcript from '../../data/transcript.json';

export interface Transcript {
  confidence: number;
  endTime: string;
  sentence: number;
  startTime: string;
  word: string;
}

export function Player() {
  const [currentTranscript, setCurrentTranscript] = useState<Transcript>();
  const [currentSentenceArray, setCurrentSentenceArray] = useState<Transcript[]>([]);
  const [currentSentenceIndex, setcurrentSentenceIndex] = useState<number>(0);
  const [sentenceTransition, setSentenceTransition] = useState<boolean>(true);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  // Save a reference to the audio element player
  let playerRef: any;

  function canPlayThrough() {
    // Ideally this would hide a loader and show the play button
  }

  function checkTranscript(currentTime: any) {
    // Check the array for transcript object that matches the current time
    const matchedTranscript: Transcript | undefined = transcript.find(
      (t: Transcript) => currentTime >= t.startTime && currentTime <= t.endTime
    );

    // Set the matched transcript as the current transcript
    if (matchedTranscript) {
      setCurrentTranscript(matchedTranscript);
    }

    // New transcript object
    if (matchedTranscript && matchedTranscript !== currentTranscript) {
      // New sentence
      if (currentSentenceIndex !== matchedTranscript.sentence) {
        setSentenceTransition(true);
        setCurrentSentenceArray([matchedTranscript]);
      } else {
        // Current sentence
        // Get the index of the current transcript object
        let tIndex = transcript.findIndex(
          (t) => t.word === matchedTranscript.word && t.startTime === matchedTranscript.startTime
        );
        // Test if the next object will be a new sentence
        if (transcript[++tIndex] && transcript[++tIndex]?.sentence === currentSentenceIndex+1) {
          setSentenceTransition(false);
        }

        setCurrentSentenceArray([...currentSentenceArray, matchedTranscript]);
      }

      setcurrentSentenceIndex(matchedTranscript.sentence);
    }
  }

  return (
    <div className="player">
      <ReactAudioPlayer
        src="/audio/birchcanoe.wav"
        autoPlay={false}
        controls
        onCanPlayThrough={canPlayThrough}
        onListen={checkTranscript}
        onEnded={() => {
          setIsPlaying(false);
        }}
        listenInterval={10}
        className="react-player"
        ref={(element) => {
          playerRef = element;
        }}
      />

      <div className="controls">

        <button
          onClick={() => {
            setIsPlaying(!isPlaying);
            isPlaying ? playerRef.audioEl.current.pause() : playerRef.audioEl.current.play();
          }}
          className={`btn btn-${isPlaying ? 'pause' : 'play'}`}
        >
          {isPlaying ? (
            <svg width="100%" height="100%" viewBox="0 0 40 40">
              <path d="M10 0H0V40H10V0Z" transform="translate(24)"></path>
              <path d="M10 0H0V40H10V0Z" transform="translate(6)"></path>
            </svg>
          ) : (
            <svg width="100%" height="100%" viewBox="0 0 40 40">
              <path fillRule="evenodd" clipRule="evenodd" d="M0 40V0L33.6 20L0 40Z" transform="translate(3)"></path>
            </svg>
          )}
        </button>

        <h1>{currentTranscript ? currentTranscript.word : 'Transcribe the Audio'}</h1>
      </div>

      <div className="sentence-wrapper">
        <Sentence sentenceArr={currentSentenceArray} active={sentenceTransition} />
      </div>
    </div>
  );
}
