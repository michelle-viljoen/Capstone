import React, { useState, useEffect, useRef } from 'react';
import ReactAudioPlayer from 'react-audio-player';
//import { PiMicrophoneStageDuotone } from "react-icons/pi";

const AudioPlayer = ({episode}) => {
  const [audioSrc, setAudioSrc] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const audioPlayerRef = useRef(null);

  useEffect(() => {
    if (episode) {
      setAudioSrc(episode.file);
      setIsPlaying(false)
    }

   
    // const lastPlaybackState = localStorage.getItem('lastPlaybackState');
    // const lastPlayedAudio = localStorage.getItem('lastPlayedAudio');
    // if(lastPlayedAudio) {
    //   setSelectedEpisode(lastPlayedAudio)
    // }

    // console.log("last played audio:", lastPlayedAudio)
    // console.log("last playback state:", lastPlaybackState)

    // if (lastPlayedAudio === audioSrc && lastPlaybackState === 'playing') {
    //   setIsPlaying(true);
    // }
  }, [episode, audioSrc]);

  const handlePlay = () => {
    setIsPlaying(true);
    // localStorage.setItem('lastPlayedAudio', audioSrc);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

    // Function to handle when the episode changes
    const handleEpisodeChange = () => {
      if (audioPlayerRef.current) {
        handlePlay(); // Start playing the audio
      }
    };

  const handleEnd = () => {
    console.log("Ended song")
    localStorage.removeItem('lastPlayedAudio');
  }

  if (!episode || !audioSrc) {
    return null;
  }

console.log('Episode.title' , episode.title)
console.log('Audiosrc', audioSrc)
console.log('Selected episode:', episode)

  return (
    <div className="audio-player" key={episode.title}>
        <h2>{episode.title} </h2>
        <ReactAudioPlayer className="audio__player"
  src={audioSrc}
  controls
  autoPlay={isPlaying} 
        onPlay={handlePlay} 
        onPause={handlePause}
        ref={audioPlayerRef}
        onEnded={handleEnd}
        onLoadedMetadata={handleEpisodeChange} 
       
/>

    </div>
  );
};

export { AudioPlayer };



