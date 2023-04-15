import { useState, useRef } from 'react'
import RatingsTable from './RatingsList'
import { Link }  from 'react-router-dom'
import Axios from 'axios'

//Component for each album block on the page
const Album = ({ album, resetAlbumListInstance, personid, apiBasePath }) => {
    
    const [rating, setRating] = useState(album.rating)

    const handleChange = event => setRating(event.target.value)
    const handleReset = () => setRating(album.rating)

    const blockRef = useRef()
    const [shadowState, setShadowState] = useState("")

    //if this is the demo user, block changing albums not added by demo user
    const setDisabledInputs = addedbypersonid => {
        if (personid == -1 && addedbypersonid != -1) {return true}
        else {return false}
    }
    //handles deleting an album and refreshing the list
    const deletealbum = id => {
        var confirm = window.confirm('Delete album?')
        confirm ?
            Axios.delete(apiBasePath + '/deletealbum/' + id)
                .then(
                    () => {
                        //album list is reset when deleting an album
                        resetAlbumListInstance()
                    }
                )
                .catch(() => window.alert('Server error'))
            : void (0)
    }
    //handles submitting a rating
    const handleSubmit = (event, albumid, rating) => {
        event.preventDefault()
        if (rating < 0 || rating > 10) {
            window.alert('Ratings must be between 0 and 10')
        }
        else if (rating == null) {
            void (0)
        }
        else {
            Axios.put(apiBasePath + '/updatescore/' + personid + '/' + albumid + '/' + rating)
                .then(
                    () => {
                        //albums list is reset for updating a score
                        resetAlbumListInstance()
                    }
                )
                .catch(() => window.alert('Server error'))
        }
    }
    //controlling the box shadow effect using state changes
    const onHover = blockRef => setShadowState(`5px 5px 5px ${album.albumcoverimg_color3}`)
    const onLeave = blockRef => setShadowState("")
    //returns the block - styling is inline and pulls from rgb strings stored in database on upload of image files
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
                    backgroundColor: album.albumcoverimg_color1,
                    boxShadow: shadowState,
                    transition: "box-shadow 0.5s"
                }
            }
        >
            <div className="columns is-vcentered">
                <div className="column is-2 has-text-centered">
                    <img
                        //getting the image from S3
                        src={'https://s3.amazonaws.com/album-ratings-backend-heroku-files/' + album.albumcoverimg}
                        alt="cover"
                        width="90%"
                    ></img>
                </div>
                <div className="column is-2" style={{ color: album.albumcoverimg_color3 }}>
                    <strong style={{ color: album.albumcoverimg_color2 }}>{album.artist}</strong><br />
                    <i style={{ color: album.albumcoverimg_color2 }}>{album.title}</i><br />
                    Release Date: {(album.releasedate == null) ? null : album.releasedate.substring(0, 10)}<br />
                    {album.genre}<br />
                    {album.recordlabel}<br />
                    Added by: {album.addedbypersonname}<br />
                    Added date: {(album.addeddate == null) ? null : album.addeddate.substring(0, 10)}<br />
                </div>
                <div className="column is-3">
                    <form className="form" name='form'>
                        <div className="field">
                            <label className="label" style={{ color: album.albumcoverimg_color2 }}>Your rating:</label>
                            <div className="control">
                                <input
                                    className="input"
                                    name='scoreRange'
                                    type="range"
                                    min="0"
                                    max="10"
                                    step="0.1"
                                    value={rating + ''}
                                    onChange={handleChange}
                                    //true if demo user and this album was added by a real user, false otherwise
                                    disabled={setDisabledInputs(album.addedbypersonid)}
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
                                            placeholder={album.rating}
                                            value={album.rating === rating ? '' : rating}
                                            onChange={handleChange}
                                            disabled={setDisabledInputs(album.addedbypersonid)}
                                        />
                                    </div>
                                </div>
                                <div className="field is-grouped">
                                    <div className="control">
                                        <input
                                            className="input"
                                            type="reset"
                                            onClick={handleReset}
                                            disabled={setDisabledInputs(album.addedbypersonid)}
                                            style={{ color: album.albumcoverimg_color1 }}
                                        />
                                    </div>
                                    <div className="control">
                                        <button
                                            type="button"
                                            className="button is-dark"
                                            disabled={setDisabledInputs(album.addedbypersonid)}
                                            onClick={e => handleSubmit(e, album.albumid, rating)}
                                            style={{ backgroundColor: album.albumcoverimg_color2, color: album.albumcoverimg_color1 }}
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
                        albumid={album.albumid}
                        ratings={album.ratings}
                        color1={album.albumcoverimg_color1}
                        color2={album.albumcoverimg_color2}
                        color3={album.albumcoverimg_color3}
                    />
                </div>
                <div className="column is-1">
                    <article className="message">
                        <div className="message-header" style={{ backgroundColor: album.albumcoverimg_color2, color: album.albumcoverimg_color1 }}>
                            <p>Average score</p>
                        </div>
                        <div className="message-body">
                            {album.averagescore}
                        </div>
                    </article>
                </div>
                <div className="column is-2">

                    <button
                        className="button is-danger"
                        onClick={() => deletealbum(album.albumid)}
                        disabled={setDisabledInputs(album.addedbypersonid)}
                        style={{ backgroundColor: album.albumcoverimg_color2, color: album.albumcoverimg_color1 }}
                    >
                        Delete Album
                    </button>
                    <br />
                    <br />
                    <Link to={`editalbum/${album.albumid}`}>
                        <button
                            className="button is-green"
                            disabled={setDisabledInputs(album.addedbypersonid)}
                            style={{ color: album.albumcoverimg_color1 }}
                        >
                            Edit Album
                        </button>
                    </Link>

                </div>
            </div>
        </div>
    )
}

export default Album