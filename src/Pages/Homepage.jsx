import React, {useEffect, useState} from 'react'
import { useNavigate, Route } from 'react-router-dom'
import { PodcastCard }  from '../components/PodcastCard'
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Fuse from 'fuse.js'
import { SingleShow } from '../components/SingleShow';
import { Favorites } from '../components/Favorites';
import { AudioPlayer } from '../components/Audioplayer';


const Homepage = ({token}) => {
    let navigate = useNavigate()

    const [podcastData, setPodcastData] = useState([])
    const [showAllPodcasts, setShowAllPodcasts] = useState(false);
    const [episodeData, setEpisodeData] = useState([]);
    const [searchInput, setSearchInput] = useState('');
    const [loading, setLoading] = useState(false);

    const [episode, setEpisode] = useState(null);

//   useEffect(() => {
//     // Retrieve selected episode from local storage when the component mounts
   
//   }, []); // Run only once when the component mounts

    useEffect(() => {
        fetch('https://podcast-api.netlify.app/shows')
        .then(res => { 
            if (!res.ok) {
                throw new Error("Something is wrong")
            }
           
             return res.json()
             
        })
        .then(data => {
            const shuffledData = shuffleArray(data);
            const selectedData = shuffledData.slice(0, 10);
            setPodcastData(selectedData)
            setLoading(false)
            const storedEpisode = localStorage.getItem('lastPlayedAudio');
            console.log('lastPlayedAudio from local storage:', storedEpisode);
            if (storedEpisode) {
              setEpisode(storedEpisode);
        
            }
            console.log("Stored episode:", storedEpisode)
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            setLoading(false);
          });
    }, [])

   

    const shuffleArray = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    };

    const PodcastCarousel = ({ podcastData }) => {
        return (
            <div className="podcastCard">
                {podcastData.length > 0 ? (
                    <Carousel infiniteLoop useKeyboardArrows showThumbs={false}>
                        {podcastData.map(item => (
                            <PodcastCard
                                key={item.id}
                                {...item}
                            />
                        ))}
                    </Carousel>
                ) : (
                    <p>Loading podcasts...</p>
                )}
            </div>
        );
    };

    
const handleHomeClick = () => {
    fetch('https://podcast-api.netlify.app/shows')
        .then(res => {
            if (!res.ok) {
                throw new Error("Failed to fetch shows");
            }
            return res.json();
        })
        .then(data => {
            const shuffledData = shuffleArray(data);
            const selectedData = shuffledData.slice(0, 10);
            setPodcastData(selectedData);
            setShowAllPodcasts(false)
            setLoading(false)
        })
        .catch(error => {
            console.error('Error fetching shows:', error);
        });
};


const handleSortZA = () => {
    const sortedData = [...podcastData].sort((a, b) => b.title.localeCompare(a.title));
    setPodcastData(sortedData);
    setShowAllPodcasts(true);
};

const handleSortAZ = () => {
    const sortedData = [...podcastData].sort((a, b) => a.title.localeCompare(b.title));
    setPodcastData(sortedData);
    setShowAllPodcasts(true);
};

const handleSortNewest = () => {
    const sortedData = [...podcastData].sort((a, b) => new Date(b.updated) - new Date(a.updated));
    setPodcastData(sortedData);
};

const handleSortOldest = () => {
    const sortedData = [...podcastData].sort((a, b) => new Date(a.updated) - new Date(b.updated));
    setPodcastData(sortedData);
};

    const handleFilterChange = (event) => {
        const selectedOption = event.target.value;
        if (selectedOption === "All") {
         //   setShowAllPodcasts(true); // Set to display all podcasts
            fetch('https://podcast-api.netlify.app/shows')
            .then(res => {
                if (!res.ok) {
                    throw new Error("Failed to fetch all shows");
                }
                return res.json();
            })
            .then(data => {
                setPodcastData(data); // Display all podcasts
                setShowAllPodcasts(true); // Set to display all podcasts
            })
            .catch(error => {
                console.error('Error fetching all shows:', error);
            });
        }  else if (selectedOption === "ZtoA") {
            handleSortZA()
        } else if (selectedOption === "AtoZ") {
            handleSortAZ()
        } else if (selectedOption === "Latest") {
            handleSortNewest()
        } else if (selectedOption === "Oldest") {
            handleSortOldest()
        } else if (selectedOption === '') {
            setShowAllPodcasts(false)
        }
    };

   const filters = <div>
        <select id="filters" onClick={handleFilterChange} >
             <option value="" disabled selected>Filters all</option>
             <option value="All" >All shows</option>
             <option value="AtoZ">A - Z</option>
             <option value="ZtoA">Z - A</option>
             <option value="Latest">Latest shows</option>
             <option value="Oldest">Oldest shows</option>
        </select>
                    </div> 

    const genreMap = {
        1: 'Personal Growth',
        2: 'True Crime and Investigative Journalism',
        3: 'History',
        4: 'Comedy',
        5: 'Entertainment',
        6: 'Business',
        7: 'Fiction',
        8: 'News',
        9: 'Kids and Family',
    };

    const handleGenreChange = (event) => {
        const selectedGenre = event.target.value;
        setSelectedGenre(selectedGenre); // Update selectedGenre state
    
        if (selectedGenre) {
            fetch('https://podcast-api.netlify.app/shows')
                .then(res => {
                    if (!res.ok) {
                        throw new Error("Failed to fetch all shows");
                    }
                    return res.json();
                })
                .then(data => {
                const filteredShows = data.filter(show =>
                    show.genres.map(genreCode => genreMap[genreCode]).includes(selectedGenre)
                )
                setShowAllPodcasts(true);
                setPodcastData(filteredShows);
                
                })
                .catch(error => {
                    console.error('Error fetching all shows:', error);
                });
        } else {
            setPodcastData([]);
            setShowAllPodcasts(false);
        }
    };


const handleSearchInputChange = (event) => {
    // event.preventDefault()
    setSearchInput(event.target.value);
};

const handleSearchSubmit = (event) => {
    event.preventDefault();
    fetch('https://podcast-api.netlify.app/shows')
            .then(res => {
                if (!res.ok) {
                    throw new Error("Failed to fetch all shows");
                }
                return res.json();
            })
            .then(data => {
                const titles = data.map(podcast => podcast.title);
    
                const filteredTitles = titles.filter(title =>
                 title.toLowerCase().includes(searchInput.toLowerCase())
    );
                const filteredPodcasts = data.filter(podcast =>
                filteredTitles.includes(podcast.title)
    );
                setPodcastData(filteredPodcasts); // Display all podcasts
                setShowAllPodcasts(true); // Set to display all podcasts
            })
            .catch(error => {
                console.error('Error fetching all shows:', error);
            });
    // setPodcastData(filteredPodcasts);
    // setShowAllPodcasts(true); // Show all filtered podcasts
};



   const SearchForm = ({ handleSearch, genres }) => (
    <form className="search__form">
      <label htmlFor="searchInput">Search by title</label><br/>
      <input type="text" id="searchInput" value={searchInput} onChange={handleSearchInputChange}/>
      <button type="submit" onClick={handleSearchSubmit}>Search</button><br/>
      <label htmlFor="genreSearch">Search by genre</label><br/>
      <select id="genreSearch" value={selectedGenre} onChange={handleGenreChange}>
        <option >Select genre</option>
        {Object.values(genreMap).map((genre) => (
          <option key={genre} value={genre}>{genre}</option>
        ))}
      </select>
    </form>
  );

const [selectedGenre, setSelectedGenre] = useState("")
        
function handleLogout() {
    sessionStorage.removeItem('token')
    navigate('/') 
}
const handleFavClicks =() => {
    navigate("/favorites")
      }

      const renderSingleShow = () => {
        if (episodeData.length > 0 && podcastData.length > 0) {
            return <SingleShow episodeData={episodeData} podcastData={podcastData} filters={filters} />;
        }
        // Return a loading indicator or null if data is not ready
        return null;
    };

      const renderFavorites = () => {
        if (episodeData.length > 0 && podcastData.length > 0) {
            return <Favorites episodeData={episodeData} podcastData={podcastData} />;
        }
        // Return a loading indicator or null if data is not ready
        return null;
    };

    if (loading) {
        return <div>Loading...</div>;
      }


    return (
        <div className='homepage'>
            {loading}
            <header className="home__header">
            <img src=".\images\3.png" width="100px" className="logoImage" />
           <h3 className='welcome'>Welcome back, {token.user.user_metadata.full_name}!</h3> 
          
           </header>
           <div className="nav">
            <button onClick={handleHomeClick}>Home</button>
            <button onClick={handleFavClicks}>Favourites</button>
            <div className="filters">{filters}</div>
           </div>
            <div>
                {<SearchForm/>}
                {/* {<HandleSearch/>} */}
            </div>
          <h4 className="second__header">Some shows you might be interested in. Go on, explore:</h4>
           {/* <div className="podcastCard">
           <PodcastCarousel podcastData={podcastData} />
            </div> */}
            <div className="podcastCard">
                {showAllPodcasts ? (
                    podcastData.map(item => (
                        <PodcastCard key={item.id} {...item} />
                    ))
                ) : (
                    <Carousel infiniteLoop useKeyboardArrows showThumbs={false}>
                        {podcastData.map(item => (
                            <PodcastCard key={item.id} {...item} />
                        ))}
                    </Carousel>
                )}
            </div>
            {/* <SingleShow episodeData={episodeData} podcastData={podcastData} /> */} 
            {renderSingleShow()}
            {/* <Favorites episodeData={episodeData} podcastData={podcastData}/> */}
        {renderFavorites()}
                          <AudioPlayer episode={episode}/>
            <button onClick={handleLogout}>Logout</button>
          <AudioPlayer episode={episode}/>
            </div>
            
    )
}
 
export { Homepage }
