import  {React, useEffect, useState} from 'react';
import useFavorites from './useFavorites';
import { FaTrashAlt } from "react-icons/fa";
import { useLocation, useNavigate } from 'react-router-dom';
import { AudioPlayer } from './Audioplayer';

const Favorites = () => {
  const { favoriteEpisodes, toggleFavorite, } = useFavorites();
  const [selectedEpisode, setSelectedEpisode] = useState('');
  const [sortedfavs, setSortedFavs] = useState([])
  const [sortOption, setSortOption] = useState('');
  let navigate = useNavigate()

  useEffect(() => {
    setSortedFavs([...favoriteEpisodes]);
}, [favoriteEpisodes]);

  console.log("Favorite Episodes:", favoriteEpisodes);

  const location = useLocation();

  const { episodeData, showData, selectedSeason } = location.state || {};

  if (!favoriteEpisodes || favoriteEpisodes.length === 0) {
    return <div>No favorite episodes yet.</div>;
  }

console.log("Show data:", showData)
    
const handleEpisodeClick = (episode) => {
  setSelectedEpisode(episode);
};


const handleRemoveToggle = (episode, index) => {
  toggleFavorite(episode, index, showData, selectedSeason);
};

const handleBack = () => {
  navigate(-1); // Navigate back to the previous page
};

const handleHome = () => {
  navigate('/homepage'); // Navigate back to the previous page
};

const handleFavZA = () => {
  const sortedFav = [...favoriteEpisodes].sort((a, b) => b.title.localeCompare(a.title));
  setSortedFavs(sortedFav);
      localStorage.setItem('favorites', JSON.stringify(sortedFav));
};

const handleFavAZ = () => {
  const sortedFav = [...favoriteEpisodes].sort((b, a) => b.title.localeCompare(a.title));
  setSortedFavs(sortedFav);
      localStorage.setItem('favorites', JSON.stringify(sortedFav));
}

const handleFavNewest = () => {
  const sortedFav = [...favoriteEpisodes].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  setSortedFavs(sortedFav);
};

const handleFavOldest = () => {
  const sortedFav = [...favoriteEpisodes].sort((b, a) => new Date(b.timestamp) - new Date(a.timestamp));
  setSortedFavs(sortedFav);
};

const handleFavSort = (event) => {
  const selectedOption = event.target.value;
  if (selectedOption === "FZtoA") {
    setSortOption(selectedOption);
      handleFavZA();
  } else if (selectedOption === "FAtoZ") {
    setSortOption(selectedOption);
    handleFavAZ();
  } else if (selectedOption === "FNewest") {
    setSortOption(selectedOption);
    handleFavNewest()
  } else if (selectedOption === "FOldest") {
    setSortOption(selectedOption);
    handleFavOldest()
  }
}


const filters = <div>
<select id="filters" onClick={handleFavSort}>
     <option value="" disabled selected>Filter favorites</option>
     <option value="FAtoZ" >A - Z</option>
     <option value="FZtoA" >Z - A</option>
     <option value="FNewest">Most recently added favorites</option>
     <option value="FOldest">Oldest favorite shows</option>
</select>
            </div> 

console.log('Episode:' , selectedEpisode)


  return (
    <div className="favorite__page">
      
      <h2 className="favorite__heading">Favorite Episodes</h2>
      <div className="favorite__nav">
      <button onClick={handleHome}>Home</button>
      <button onClick={handleBack}>Back</button>
      <div className="favorite__filters">{filters}</div>
      </div>
    
      <ul>
      {sortedfavs.map(episode => (
  <li key={episode.title} className="favorite__card">
      <h3 className="favorite__title">{episode.title}</h3>
     
      <img src={episode.selectedSeason.image} width="100px" className="favorite__image"/>
      <div className="trash__position">
      <FaTrashAlt onClick={() => handleRemoveToggle(episode, showData, selectedSeason)} className="trashcan"/>
      <p className="favorite__updated">Added: {new Date(episode.timestamp).toLocaleString()}</p>
      <button onClick={() => handleEpisodeClick(episode)}  className="play__button" >Play Episode</button>
      </div>
      <p className="favorite__description">Description: {episode.description}</p>
      <h4 className="favorite__show">Show: {episode.selectedSeason.title}</h4>
      <h4 className="favorite__season">Season: {selectedSeason}</h4>
      <p className="favorite__episode">Episode Number: {episode.episode}</p>
    { episode.selectedSeason.genres && <p className="favorite__genre">Genre: {episode.selectedSeason.genres.filter(genre => genre !== "Featured" && genre !== "All").join(', ')}</p>}
      
  </li>
))}
      </ul>
      <AudioPlayer episode={selectedEpisode} />
    </div>
  );
};

export { Favorites };



