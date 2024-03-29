import { useContext } from 'react';
import { FavoritesContext } from './FavComponents';

 const useFavorites = () => useContext(FavoritesContext);

export default useFavorites
