import  {React, useEffect, useState} from 'react';
import {useFavorites} from './useFavorites';
import { FaTrashAlt } from "react-icons/fa";
import { useLocation, useNavigate } from 'react-router-dom';
import {AudioPlayer} from './Audioplayer';

// component that controls the rendering of the favorited episodes 
const Favorites = () => {
  const { favoriteEpisodes, toggleFavorite, } = useFavorites();
  const [selectedEpisode, setSelectedEpisode] = useState('');
  const [sortedfavs, setSortedFavs] = useState([])
  const [sortOption, setSortOption] = useState('');
  let navigate = useNavigate()

  // spreads favorites to sort them for the filters for favorites 
  useEffect(() => {
    setSortedFavs([...favoriteEpisodes]);
}, [favoriteEpisodes]);

  console.log("Favorite Episodes:", favoriteEpisodes);

  const location = useLocation();

  // takes state passed to it from single show 
  const { episodeData, showData, selectedSeason } = location.state || {};

  // page to display if there are no favorites selected yet
  if (!favoriteEpisodes || favoriteEpisodes.length === 0) {
    return <div>No favorite episodes yet.</div>;
  }

console.log("Show data:", showData)
    
// sets the selected episode to the clicked on episode 
const handleEpisodeClick = (episode) => {
  setSelectedEpisode(episode);
};

// removes an item from favorites 
const handleRemoveToggle = (episode, index) => {
  toggleFavorite(episode, index, showData, selectedSeason);
};

// takes a user back to the pervious page 
const handleBack = () => {
  navigate(-1); 
};

// takes a user back to the home page 
const handleHome = () => {
  navigate('/homepage'); 
};

// the filters available for favorite episodes 
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

// how the filters are implemented based on selection 
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

// possible filters for favorites 
const filters = <div>
<select id="filters" onClick={handleFavSort}>
     <option value="" disabled selected>Filter favorites</option>
     <option value="FAtoZ" >A - Z</option>
     <option value="FZtoA" >Z - A</option>
     <option value="FNewest">Newest favorites</option>
     <option value="FOldest">Oldest favorites</option>
</select>
            </div> 

console.log('Episode:' , selectedEpisode)


  return (
    <div className="favorite__page">
      
      <h2 className="favorite__heading">Favorite Episodes</h2>
      <img src="..\images\3.png"  className="pageLogoImage" />
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

export  {Favorites};

// It's updating for the episode in the console, but not changing on the screen, so somewhere between storing it in Favs and rendering those Favs on the screen, something is missing.
// This is an example of what favoriteEpisodes looks like in the console:
// (10) [{...}, {...}, {...}, {...}, {...}]
// 0: 
// description: "The description of the episode"
// episode: 4
// file: "https://podcast-file"
// selectedSeason:
// description: "description of the show"
// genres: ['All', 'Featured', 'History']
// id: "9994"
// image: "image for show"
// seasons: Array (1) 
// 0: {season: 1, title: "Season 1", image: "image"}
// length: 1
// title: "Tomorrow" 
// updated: "Date"


