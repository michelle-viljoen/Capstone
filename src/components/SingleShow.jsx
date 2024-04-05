import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MdFavorite, MdFavoriteBorder } from "react-icons/md";
import { useFavorites} from './useFavorites';
import {AudioPlayer} from './Audioplayer';

const SingleShow = ({episodeData, podcastData, filters, episodes}) => {
    let navigate = useNavigate()
    const { id } = useParams();
    const [showData, setShowData] = useState(null);
    const [selectedSeason, setSelectedSeason] = useState('');
    const [selectedSeasonEpisodes, setSelectedSeasonEpisodes] = useState([]);
    const [favorite, setFavorite] = useState(false)
    const { favoriteEpisodes, toggleFavorite } = useFavorites();
    
    // prepares the information to render the list of episodes
    const EpisodesList = ({ episodes, onSelectEpisode}) => {
      const { favoriteEpisodes, toggleFavorite } = useFavorites();
      // passes data to the toggle favorite function 
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

    // renders the episodes to the screen and stores the last selected audio to local storage 
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

    // displays the list of seasons for the show
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

// lets user navigate to the home page when button is clicked 
    const handleHomeClick = () => {
        navigate('/homepage')
    }

    // calls the api for the specific show data that a user wants to view based on clicking on that podcast card 
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

    // if a show is selected and a season is selected, display the season's episodes 
    useEffect(() => {
        if (showData && selectedSeason) {
            const season = showData.seasons.find(season => season.title === selectedSeason);
            if (season) {
                setSelectedSeasonEpisodes(season.episodes);
            }
        }
    }, [showData, selectedSeason]);

    // when a new season is clicked, display the new list of episodes 
    const handleSeasonChange = (seasonTitle) => {
        setSelectedSeason(seasonTitle);
    };

    // if there is no data, return a loading state 
    if (!showData) {
        return <div>Loading...</div>;
    }
        
    // if a user clicks on the show title it collapses the episode information and takes them back to the original show view
    const collapseEpisodes = () => {
        setSelectedSeason(false)
    }
  
    // takes a user to the favorites page and sets the state for the favorites to use the information required 
  const handleFavClicks = () => {
    navigate("/favorites", {
      state: { episodeData, showData, selectedSeason }
    });
  };
  
// tried to display the audio based on the previously selected audio, before clicking on a new one 
//   const renderAudio = () => {
//     return (
// <AudioPlayer episode={selectedEpisode} onSelectEpisode={handleEpisodeClick}/>
//     )
//   }

console.log("Show data:", showData)
    return (
        <div className="singleShow__page">
           
            <header className="single__header">
            <img src="..\images\3.png"  className="pageLogoImage" />
           <div className="top__buttons">
            <button onClick={handleHomeClick}>Home</button>
            <button onClick={() => handleFavClicks({ episodeData, showData, selectedSeason })}>Favorites</button>
           </div>
           </header>
          
           <div className="singleshow__content">
            <h1 onClick={collapseEpisodes} className="single__title">{showData.title}</h1>

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
             
              {selectedSeason && <EpisodesListRender episodes={selectedSeasonEpisodes} />}
  
      <AudioPlayer />
        </div>
        </div>
    );
};

export {SingleShow};
