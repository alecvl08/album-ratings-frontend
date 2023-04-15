import Axios from 'axios'
import { useState, useEffect } from 'react'
import { useNavigate, Link }  from 'react-router-dom'
import apiBasePath from './globalVars'
import Album from './Album'

function Main() {
    const [sort, setSort] = useState({field: "addeddate", direction: "desc"})
    const handleSortChange = e => setSort({...sort, [e.target.name]: e.target.value})

    //this state is a timestamp that marks the unique "instance" of the albums list which is part of the redis cache's key for an album list
    const [albumListInstance, setAlbumListInstance] = useState(Date.now())
    const resetAlbumListInstance = () => setAlbumListInstance(Date.now())

    const personid = localStorage.getItem('personid')

    const navigate = useNavigate()

    const demoModeTitle = personid => {
        if (personid == -1) {
            return (
                <>
                    <h4 className="title is-4 has-text-white">Demo Mode:</h4>
                    <div className="box has-text-left">
                        <div className="content">
                            <p>
                                Editing or deleting albums and ratings added by registered users is disabled
                            </p>
                            <p>
                                You can add albums and edit, delete, and rate the albums you add
                            </p>
                            <p>
                                Albums added in Demo Mode will be deleted automatically
                            </p>
                        </div>
                    </div>
                </>
            )
        }
    }

    //if localStorage has personid 'null' on page load, navigate to the login. Else get the album list
    const logoutOrGetAlbums = personid => {
        if (personid === 'null') {navigate('/login')}
        else {getAlbums(sort.field, sort.direction, albumListInstance)}
    }
    useEffect(() => logoutOrGetAlbums(personid), [sort, albumListInstance])

    //getAlbums is the driver of this page - called on any sort change or data update - gets list of albums and their ratings
    const [albumsList, setAlbumsList] = useState([])
    const getAlbums = (sortField, sortDirection, albumListInstance) => {
        Axios.get(apiBasePath + '/getalbums/' + personid + "/" + sortField + "/" + sortDirection + '/' + albumListInstance)
            .then(res => {setAlbumsList(res.data)})
            .catch(() => window.alert('Server error'))
    }

    return (
        <>
            <section className="section has-background-link-dark">
                <div className="columns is-centered">
                    <div className="column">
                        <Link to="login">
                            <button className="button is-white" onClick={() => localStorage.setItem('personid', null)}>Log out</button>
                        </Link>
                    </div>
                    <div className="column is-half has-text-centered">
                        <h1 className="title is-1 has-text-white">Albums of the Year</h1>
                        {demoModeTitle(personid)}
                    </div>
                    <div className="column has-text-right">
                        <Link to='addalbum'>
                            <button className="button is-white">Add album</button>
                        </Link>
                    </div>
                </div>
            </section>
            <div className="box">
                <form className="form">
                    <div className="field is-horizontal">
                        <div className="field-label is-normal">
                            <label className="label">Sort</label>
                        </div>
                        <div className="field-body">
                            <div className="field is-grouped">
                                <div className="control">
                                    <div className="select">
                                        <select name="field" value={sort.field} onChange={handleSortChange}>
                                            <option value="addeddate">Added Date</option>
                                            <option value="releasedate">Release Date</option>
                                            <option value="artist">Artist</option>
                                            <option value="title">Title</option>
                                            <option value="averagescore">Average Rating</option>
                                            <option value="rating">Your Rating</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="control">
                                    <div className="select">
                                        <select name="direction" value={sort.direction} onChange={handleSortChange}>
                                            <option value="asc">Ascending</option>
                                            <option value="desc">Descending</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
            {
                albumsList.map(
                    album => (
                        <Album
                            key={album.albumid}
                            album={album}
                            resetAlbumListInstance={resetAlbumListInstance}
                            personid={personid}
                            apiBasePath={apiBasePath}
                        />
                    )
                )
            }
        </>
    )
}

export default Main