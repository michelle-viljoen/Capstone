import React, { useState, useEffect, useRef } from 'react';
import ReactAudioPlayer from 'react-audio-player';
//import { PiMicrophoneStageDuotone } from "react-icons/pi";


// renders the audio player with the selected episode information
const AudioPlayer = ({episode}) => {
  const [audioSrc, setAudioSrc] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const audioPlayerRef = useRef(null);

  // sets the source for the audioplayer 
  useEffect(() => {
    if (episode) {
      setAudioSrc(episode.file);
      setIsPlaying(false)
    }

   // tried to use local storage to get and set episodes so one is always selected for audioplayer to always show on the screen 
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


  // sets the state of the audioplayer when it is playing 
  const handlePlay = () => {
    setIsPlaying(true);
    // localStorage.setItem('lastPlayedAudio', audioSrc);
  };

   // sets the state of the audioplayer when it is paused 
  const handlePause = () => {
    setIsPlaying(false);
  };

    // Function to handle when the episode changes
    const handleEpisodeChange = () => {
      if (audioPlayerRef.current) {
        handlePlay(); // Start playing the audio
      }
    };

    // removes audio play storage once played 
  const handleEnd = () => {
    console.log("Ended song")
    localStorage.removeItem('lastPlayedAudio');
  }

  // don't return anything in the audioplayer until there is an episode and a source file to play 
  if (!episode || !audioSrc) {
    return null;
  }

console.log('Episode.title' , episode.title)
console.log('Audiosrc', audioSrc)
console.log('Selected episode:', episode)

  return (
    <div className="audio-player" key={episode.title}>
        <h2>{episode.title}</h2>
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

export {AudioPlayer};



