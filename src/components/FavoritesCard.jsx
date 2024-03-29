import React, {useEffect, useState} from 'react'
import Favorites from './Favorites';
import SingleShow from './SingleShow';

 //export default function FavoritesCard ({episode, season})  {

// const FavoritesPage = ({ episodeData, showData, selectedSeason }) => {
//   return (
//     <div>
//       {/* Render any other content of the favorites page */}
//       <Favorites episodeData={episodeData} showData={showData} selectedSeason={selectedSeason} />
//     </div>
//   );
// };



//}



const FavoritesCard = () => {
  return (
    <div>
      <Favorites episodeData={episodeData} showData={showData} selectedSeason={selectedSeason} />
    </div>
  );
};

export default FavoritesCard;


//