import { useState, createContext, useEffect } from 'react';
export const FavoritesContext = createContext();
export const FavoritesProvider = ({ children }) => {
 
  const [favoriteEpisodes, setFavoriteEpisodes] = useState([]);

  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem('favorites'));
    if (storedFavorites) {
      setFavoriteEpisodes(storedFavorites);
    }
  }, []);

  const toggleFavorite = (episode, showData, selectedSeason) => {
    const timestamp = new Date().toISOString(); 

    const isFavorite = favoriteEpisodes.some(favorite => favorite.title === episode.title);
    if (isFavorite) {
        const updatedFavorites = favoriteEpisodes.filter(favorite => favorite.title !== episode.title);
        setFavoriteEpisodes(updatedFavorites);
        localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    } else {
        // Merge the showData with the episode
        const newFavorite = { 
            ...episode, 
            showData: { ...showData }, // Make a shallow copy of showData
            selectedSeason, 
            timestamp 
        };
        const updatedFavorites = [...favoriteEpisodes, newFavorite];
        setFavoriteEpisodes(updatedFavorites);
        localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    }
};

  return (
    <FavoritesContext.Provider value={{ favoriteEpisodes, toggleFavorite, setFavoriteEpisodes }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export default FavoritesProvider


