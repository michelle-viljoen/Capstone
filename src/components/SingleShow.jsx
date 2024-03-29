import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MdFavorite, MdFavoriteBorder } from "react-icons/md";
//import { supabase } from '@supabase/auth-ui-shared';
import  { useFavorites } from './useFavorites';
import { Favorites } from './Favorites';
import { AudioPlayer } from './Audioplayer';

const SingleShow = ({episodeData, podcastData, filters, episodes}) => {
    let navigate = useNavigate()
    const { id } = useParams();
    const [showData, setShowData] = useState(null);
    const [selectedSeason, setSelectedSeason] = useState('');
    const [selectedSeasonEpisodes, setSelectedSeasonEpisodes] = useState([]);
    const [favorite, setFavorite] = useState(false)
    const { favoriteEpisodes, toggleFavorite } = useFavorites();
    

    // useEffect(() => {
    //     // Check if the current episode is already in favorites
    //     setFavorite(favoriteEpisodes.includes(id));
    // }, [favoriteEpisodes, id]);

    
    const EpisodesList = ({ episodes, onSelectEpisode}) => {
      const { favoriteEpisodes, toggleFavorite } = useFavorites();
      
      const handleFavoriteToggle = (episode, index) => {
        toggleFavorite(episode, index, showData, selectedSeason, favoriteEpisodes);
      };
    
      return (
        <div>
          <h3 className="episode__select">Episodes ({episodes.length}):</h3>
          <ol>
            {episodes.map((episode, index) => (
              <li key={`${episode.title}-${index}`} className="episode__list">
                <div className="episode__layout">
                <button onClick={() => handleFavoriteToggle(episode, index, showData, selectedSeason)}>
    
                  {favoriteEpisodes.some(favEpisode => favEpisode.title === episode.title) ? <MdFavorite className="heart"/> : <MdFavoriteBorder className="heart"/>}
                </button>
                <h4 className="episode__title">{episode.title}</h4>
                </div> 
                <button  onClick={() => onSelectEpisode(episode)} className="play__episode">Play Audio</button>
                <p className="episode__description">{episode.description}</p>
                
               
              </li>
            ))}
          </ol>
        </div>
      );
    };

    const EpisodesListRender = ({ episodes }) => {
      // const [selectedEpisode, setSelectedEpisode] = useState('');
      const lastPlayedAudio = localStorage.getItem('lastPlayedAudio');
      const [selectedEpisode, setSelectedEpisode] = useState(
        lastPlayedAudio ? JSON.stringify(lastPlayedAudio) : ''
      );

      useEffect(() => {
        if (lastPlayedAudio) {
          setSelectedEpisode(lastPlayedAudio);
        }
      }, [lastPlayedAudio]);

      const handleEpisodeClick = (episode) => {
        setSelectedEpisode(episode);
        localStorage.setItem('lastPlayedAudio', episode)
      };
      
    console.log('Selected episode:', selectedEpisode)
    console.log("Last played audio", lastPlayedAudio)
      return (
        <div>
          <EpisodesList episodes={episodes} onSelectEpisode={handleEpisodeClick} />
          <AudioPlayer episode={selectedEpisode} onSelectEpisode={handleEpisodeClick}/>   
        </div>
      );
    };

const SeasonsList = ({ seasons, selectedSeason, onSeasonChange }) => {
  const handleSeasonClick = (season) => {
    onSeasonChange(season.title);
  };

  return (
    <div>
      <h3 className="select__season">Select a season</h3>
      <ul >
       
        {seasons.map(season => (
          <li key={season.title}  onClick={() => handleSeasonClick(season)} className="single__season">
            <p>Season: {season.season}</p>
             <button className="season__button">
            <img src={season.image} alt={season.title} className="season__image" value={selectedSeason} />
            {season.title}
            </button>
           
          </li>
        
        ))}
        
      </ul>
    </div>
  );
};

    const handleHomeClick = () => {
        navigate('/homepage')
    }

    useEffect(() => {
        fetch(`https://podcast-api.netlify.app/id/${id}`)
            .then(res => res.json())
            .then(data => {
                setShowData(data);
            })
            .catch(error => {
                console.error('Error fetching show data:', error);
            });
    }, [id]);

    useEffect(() => {
        if (showData && selectedSeason) {
            const season = showData.seasons.find(season => season.title === selectedSeason);
            if (season) {
                setSelectedSeasonEpisodes(season.episodes);
            }
        }
    }, [showData, selectedSeason]);

    const handleSeasonChange = (seasonTitle) => {
        setSelectedSeason(seasonTitle);
    };

    if (!showData) {
        return <div>Loading...</div>;
    }

    // const handleFav = () => {
    //     // Toggle favorite status
    //     setFavorite(!favorite);
    
    //     toggleFavorite(id);
    // };
    
        
    const collapseEpisodes = () => {
        setSelectedSeason(false)
    }
  
  const handleFavClicks = () => {
    // if (!showData || !selectedSeason) {
    //   alert("Show data or selected season is not available yet.");
    //   // Optionally, you can show a loading indicator or return early
    //   return;
    // }
    navigate("/favorites", {
      state: { episodeData, showData, selectedSeason }
    });
  };
  

  //   const renderFavs = () => {
  //     if (showData.length > 0 && podcastData.length > 0) {
  //         return <Favorites episodeData={episodeData} podcastData={podcastData} showData={showData} filters={filters} />;
  //     }
  //     // Return a loading indicator or null if data is not ready
  //     return null;
  // };

//   const renderAudio = () => {
//     return (
// <AudioPlayer episode={selectedEpisode} onSelectEpisode={handleEpisodeClick}/>
//     )
//   }
console.log("Show data:", showData)
    return (
        <div className="singleShow__page">
            <header className="single__header">
           <div className="top__buttons">
            <button onClick={handleHomeClick}>Home</button>
            <button onClick={() => handleFavClicks({ episodeData, showData, selectedSeason })}>Favourites</button>
           </div>
           </header>
           <div className="singleshow__content">
            <h1 onClick={collapseEpisodes} className="single__title">{showData.title}</h1>
           {/* { favorite ? <MdFavorite onClick={() => handleFav()} /> : <MdFavoriteBorder onClick={() => handleFav()} /> } */}

            <img className='preview__image' src={showData.image} width="150px"/>
            <p className='preview__updated'>Last updated: {new Date(showData.updated).toDateString()}</p>
            {showData.genres && (
  <p className='singleShow__genres'>{showData.genres.filter(genre => genre !== "Featured" && genre !== "All").join(', ')}</p>
)}
            <p className="singleShow__description">{showData.description}</p>
            

                     <SeasonsList
                    seasons={showData.seasons}
                    selectedSeason={selectedSeason}
                    onSeasonChange={handleSeasonChange}
             />
              {/* {selectedSeason && <EpisodesList episodes={selectedSeasonEpisodes} />} */}
              {selectedSeason && <EpisodesListRender episodes={selectedSeasonEpisodes} />}
           {/* <Favorites episodeData={episodeData} showData={showData} selectedSeason={selectedSeason} /> */}
       {/* {renderFavs()} */}
     
  
      <AudioPlayer />
        </div>
        </div>
    );
};

export { SingleShow };
