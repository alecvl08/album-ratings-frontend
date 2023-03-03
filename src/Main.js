import Axios from 'axios'
import { useState, useEffect, useRef } from 'react'
import { useNavigate, Link }  from 'react-router-dom'
import apiBasePath from './globalVars'

function Main() {
    const [sort, setSort] = useState(
        {
            field: "addeddate",
            direction: "desc"
        }
    )
    const handleSortChange = e => {
        setSort(
            {
                ...sort, [e.target.name]: e.target.value
            }
        )
    }
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
    const logout = personid => {if(personid === 'null') {navigate('/login')}}
    useEffect(
        () => {logout(personid)}, []
    )

    const [albumsList, setAlbumsList] = useState([])
    const getAlbums = (sortField, sortDirection) => {
        Axios.get(apiBasePath + '/getalbums/' + personid + "/" + sortField + "/" + sortDirection)
            .then(
                res => {
                    let albums = []
                    for (let i = 0; i < res.data.length; i++) {
                        albums[i] = {
                            index: i,
                            album: res.data[i],
                        }
                    }
                    setAlbumsList(albums)
                }
            )
    }
    useEffect(() => getAlbums(sort.field, sort.direction),[sort])
    const RatingsTable = ({ albumid, color1, color2, color3 }) => {
        const [rows, setRows] = useState([])
        useEffect(
            () => {
                Axios.get(apiBasePath + '/albumratings/' + albumid)
                    .then(res => {setRows(res.data)})
                    .catch(err => {console.error(err)})
            },
            [albumid]
        )
        return (
            <div className="table-container" style={{maxHeight: "150px", overflowY: "scroll"}}>
                <table className="table is-bordered is-fullwidth" style={{color: color1}}>
                    <thead style={{backgroundColor: color2}}>
                        <tr>
                            <td style={{color: color1}}>Name</td>
                            <td style={{color: color1}}>Rating</td>
                        </tr>
                    </thead>
                    <tbody style={{backgroundColor: color3}}>
                        {
                            rows.map(
                                row => (
                                    <tr key={albumid + ' ' + row.personname}>
                                        <td>{row.personname}</td>
                                        <td>{row.rating}</td>
                                    </tr>
                                )
                            )
                        }
                    </tbody>
                </table>
            </div>
        )
    }
    const Album = ({ album, index, ratings, handleChange, handleReset }) => {
        const inputRef = useRef()
        const blockRef = useRef()
        const [shadowState, setShadowState] = useState("")
        const setDisabledInputs = addedbypersonid => {
            if (personid == -1 && addedbypersonid != -1) {
                return true
            }
            else {
                return false
            }
        }
        const deletealbum = (id) => {
            var confirm = window.confirm('Delete album?')
            confirm ?
                Axios.delete(apiBasePath + '/deletealbum/' + id)
                    .then(
                        () => getAlbums(sort.field, sort.direction)
                    )
                : void (0)
        }
        const handleSubmit = (event, albumid, rating) => {
            event.preventDefault()
            if (rating < 0 || rating > 10) {
                window.alert('Ratings must be between 0 and 10')
            }
            else if (rating === "") {
                void (0)
            }
            else {
                Axios.put(apiBasePath + '/updatescore/' + personid + '/' + albumid + '/' + rating)
                    .then(() => {getAlbums(sort.field, sort.direction)})
            }
        }
        const onHover = blockRef => {setShadowState(`5px 5px 5px ${album.album.albumcoverimg_color3}`)}
        const onLeave = blockRef => {setShadowState("")}
        return (
            <div
                className="block"
                name="albumBlock"
                ref={blockRef}
                onMouseOver={() => onHover(blockRef)}
                onMouseLeave={() => onLeave(blockRef)}
                style={
                    {
                        margin: "2%",
                        backgroundColor: album.album.albumcoverimg_color1,
                        boxShadow: shadowState,
                        transition: "box-shadow 0.5s"
                    }
                }
            >
                <div className="columns is-vcentered">
                    <div className="column is-2 has-text-centered">
                        <img
                            src={'https://s3.amazonaws.com/album-ratings-backend-heroku-files/' + album.album.albumcoverimg}
                            alt="cover"
                            width="90%"
                        ></img>
                    </div>
                    <div className="column is-2" style={{ color: album.album.albumcoverimg_color3 }}>
                        <strong style={{ color: album.album.albumcoverimg_color2 }}>{album.album.artist}</strong><br />
                        <i style={{ color: album.album.albumcoverimg_color2 }}>{album.album.title}</i><br />
                        Release Date: {(album.album.releasedate == null) ? null : album.album.releasedate.substring(0, 10)}<br />
                        {album.album.genre}<br />
                        {album.album.recordlabel}<br />
                        Added by: {album.album.addedbypersonname}<br />
                        Added date: {(album.album.addeddate == null) ? null : album.album.addeddate.substring(0, 10)}<br />
                    </div>
                    <div className="column is-3">
                        <form className="form" name='form'>
                            <div className="field">
                                <label className="label" style={{ color: album.album.albumcoverimg_color2 }}>Your rating:</label>
                                <div className="control">
                                    <input
                                        className="input"
                                        name='scoreRange'
                                        type="range"
                                        min="0"
                                        max="10"
                                        step="0.1"
                                        value={ratings[index] + ''}
                                        onChange={(e) => handleChange(index, e.target.value)}
                                        disabled={setDisabledInputs(album.album.addedbypersonid)}
                                        ref={inputRef}
                                    />
                                </div>
                            </div>
                            <div className="field is-horizontal">
                                <div className="field-body">
                                    <div className="field">
                                        <div className="control">
                                            <input
                                                className="input"
                                                name='scoreNum'
                                                type="number"
                                                min="0"
                                                max="10"
                                                step="0.1"
                                                placeholder={album.album.rating}
                                                value={album.album.rating === ratings[index] ? '' : ratings[index]}
                                                onChange={(e) => handleChange(index, e.target.value)}
                                                disabled={setDisabledInputs(album.album.addedbypersonid)}
                                            />
                                        </div>
                                    </div>
                                    <div className="field is-grouped">
                                        <div className="control">
                                            <input
                                                className="input"
                                                type="reset"
                                                onClick={() => handleReset(index, inputRef)}
                                                disabled={setDisabledInputs(album.album.addedbypersonid)}
                                                style={{ color: album.album.albumcoverimg_color1 }}
                                            />
                                        </div>
                                        <div className="control">
                                            <button
                                                type="button"
                                                className="button is-dark"
                                                disabled={setDisabledInputs(album.album.addedbypersonid)}
                                                onClick={e => handleSubmit(e, album.album.albumid, ratings[index])}
                                                style={{ backgroundColor: album.album.albumcoverimg_color2, color: album.album.albumcoverimg_color1 }}
                                            >
                                                Submit
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div className="column is-2">
                        <RatingsTable
                            albumid={album.album.albumid}
                            color1={album.album.albumcoverimg_color1}
                            color2={album.album.albumcoverimg_color2}
                            color3={album.album.albumcoverimg_color3}
                        />
                    </div>
                    <div className="column is-1">
                        <article className="message">
                            <div className="message-header" style={{ backgroundColor: album.album.albumcoverimg_color2, color: album.album.albumcoverimg_color1 }}>
                                <p>Average score</p>
                            </div>
                            <div className="message-body">
                                {album.album.averagescore}
                            </div>
                        </article>
                    </div>
                    <div className="column is-2">

                        <button
                            className="button is-danger"
                            onClick={() => { deletealbum(album.album.albumid) }}
                            disabled={setDisabledInputs(album.album.addedbypersonid)}
                            style={{ backgroundColor: album.album.albumcoverimg_color2, color: album.album.albumcoverimg_color1 }}
                        >
                            Delete Album
                        </button>
                        <br />
                        <br />
                        <Link to={`editalbum/${album.album.albumid}`}>
                            <button
                                className="button is-green"
                                disabled={setDisabledInputs(album.album.addedbypersonid)}
                                style={{ color: album.album.albumcoverimg_color1 }}
                            >
                                Edit Album
                            </button>
                        </Link>

                    </div>
                </div>
            </div>
        )
    }

    const AlbumList = ({ albums }) => {
        const [ratings, setRatings] = useState(albums.map(album => album.album.rating))
        const handleChange = (index, newRating) => {
            const newRatings = [...ratings]
            newRatings[index] = newRating
            setRatings(newRatings)
        }
        const handleReset = (index, inputRef) => {
            setRatings(
                ratings => {
                    const newRatings = [...ratings]
                    newRatings[index] = albums[index].album.rating
                    inputRef.current.value = undefined
                    return newRatings
                }
            )
        }
        return (
            <>
                {
                    albums.map(
                        (album, index) => (
                            <Album
                                key={album.index}
                                album={album}
                                index={index}
                                ratings={ratings}
                                handleChange={handleChange}
                                handleReset={handleReset}
                            />
                        )
                    )
                }
            </>
        )
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
            <AlbumList albums={albumsList} />
        </>
    )
}

export default Main