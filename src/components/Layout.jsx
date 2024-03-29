import React, { useState, useEffect } from 'react';

import EpisodesListRender from './EpisodesListRender'; // Import EpisodesListRender component here
import AudioPlayer from './Audioplayer'; // Import AudioPlayer component here

const Layout = () => {
  const [selectedEpisode, setSelectedEpisode] = useState('');
  const lastPlayedEpisode = localStorage.getItem('lastPlayedEpisode');

  useEffect(() => {
    if (lastPlayedEpisode) {
      setSelectedEpisode(JSON.parse(lastPlayedEpisode));
    }
  }, [lastPlayedEpisode]);

  const handleEpisodeClick = (episode) => {
    setSelectedEpisode(episode);
    localStorage.setItem('lastPlayedEpisode', JSON.stringify(episode));
  };

  return (
    <div>
      <EpisodesListRender onSelectEpisode={handleEpisodeClick} />
      <AudioPlayer episode={selectedEpisode} onSelectEpisode={handleEpisodeClick} />
    </div>
  );
};

export default Layout;
