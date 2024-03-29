import Axios from 'axios'
import { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUpload } from '@fortawesome/free-solid-svg-icons'
import apiBasePath from './globalVars'

function EditAlbum() {

    const navigate = useNavigate()

    const personid = localStorage.getItem('personid')

    const logout = personid => {if(personid === 'null') {navigate('/login')}}
    useEffect(() => logout(personid),[])

    const [isSubmitting, setIsSubmitting] = useState(false)

    const { id } = useParams()
    const [formData, setFormData] = useState(
        {
            artist: '',
            title: '',
            genre: '',
            recordLabel: '',
            releaseDate: '',
            coverImage: '',
            coverImageName: ''
        }
    )

    //on page load get the album to be edited by its ID and pre-populate the fields
    useEffect(
        () => {
            Axios.get(apiBasePath + '/getalbum/' + id)
                .then(
                    res => {
                        setFormData(
                            {
                                artist: res.data[0].artist,
                                title: res.data[0].title,
                                genre: res.data[0].genre,
                                recordLabel: res.data[0].recordlabel,
                                releaseDate: (res.data[0].releasedate) ? res.data[0].releasedate.substring(0, 10) : '',
                                coverImageName: 'Current File'
                            }
                        )
                    }
                )
                .catch(() => window.alert('Server error'))
        },
        []
    )

    const handleChange = event => {
        setFormData(
            {
                ...formData, [event.target.name]: event.target.value
            }
        )
    }

    const handleImageChange = event => {
        if (
            event.target.files[0].type.split('/')[1] !== 'jpeg' &&
            event.target.files[0].type.split('/')[1] !== 'jpg' &&
            event.target.files[0].type.split('/')[1] !== 'png'
        ) {
            window.alert('Album cover images must be .jpeg, .jpg, or .png')
        }
        else {
            setFormData(
                {
                    ...formData,
                    coverImage: event.target.files[0],
                    coverImageName: event.target.files[0].name
                }
            )
        }
    }

    const handleSubmit = event => {
        event.preventDefault()
        setIsSubmitting(true)
        let formDataObj = new FormData()
        formDataObj.append('albumid',id)
        formDataObj.append('artist',formData.artist)
        formDataObj.append('title',formData.title)
        formDataObj.append('genre',formData.genre)
        formDataObj.append('recordLabel',formData.recordLabel)
        formDataObj.append('releaseDate',formData.releaseDate)
        if (formData.coverImageName !== 'Current File') {
            formDataObj.append('coverImage',formData.coverImage)
        }
        Axios.post(
            apiBasePath + '/editalbum',
            formDataObj,
            {
                headers: {
                    "Content-Type": 'multipart/form-data'
                }
            }
        )
            .then(
                () => {
                    setIsSubmitting(false)
                    var confirm = window.confirm('Album updated')
                    confirm ?
                        navigate('/')
                    : void (0)
                }
            )
            .catch(
                err => {
                    setIsSubmitting(false)
                    //custom catch for one known error
                    if (err.response.data.message === 'Possible corrupted or invalid image; please try another') {
                        window.alert('Server error: ' + err.response.data.message)
                    } else {
                        window.alert('Server error')
                    }
                }
            )
    }

    return (
        <>
            <section className="section has-background-link-dark">
                <div className="columns is-centered">
                    <div className="column">
                        <Link to='/'>
                            <button className='button is-white'>Back to Home</button>
                        </Link>
                    </div>
                    <div className="column is-half has-text-centered">
                        <h1 className="title is-1 has-text-white">Albums of the Year</h1>
                    </div>
                    <div className="column"></div>
                </div>
            </section>
            <div className="container is-max-desktop">
                <div className="box">
                    <div className="content has-text-centered">
                        <h1>Edit Album</h1>
                    </div>
                    <form className="form" encType="multipart/form-data" onSubmit={handleSubmit}>
                        <div className="field is-horizontal">
                            <div className="field-label is-normal">
                                <label className="label">Artist:</label>
                            </div>
                            <div className="field-body">
                                <div className="field">
                                    <div className="control">
                                        <input
                                            className="input"
                                            type="text"
                                            name="artist"
                                            value={formData.artist}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="field is-horizontal">
                            <div className="field-label is-normal">
                                <label className="label">Title:</label>
                            </div>
                            <div className="field-body">
                                <div className="field">
                                    <div className="control">
                                        <input
                                            className="input"
                                            type="text"
                                            name="title"
                                            value={formData.title}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="field is-horizontal">
                            <div className="field-label is-normal">
                                <label className="label">Genre:</label>
                            </div>
                            <div className="field-body">
                                <div className="field">
                                    <div className="control">
                                        <input
                                            className="input"
                                            type="text"
                                            name="genre"
                                            value={formData.genre}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="field is-horizontal">
                            <div className="field-label is-normal">
                                <label className="label">Record Label:</label>
                            </div>
                            <div className="field-body">
                                <div className="field">
                                    <div className="control">
                                        <input
                                            className="input"
                                            type="text"
                                            name="recordLabel"
                                            value={formData.recordLabel}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="field is-horizontal">
                            <div className="field-label is-normal">
                                <label className="label">Release Date:</label>
                            </div>
                            <div className="field-body">
                                <div className="field is-narrow">
                                    <div className="control">
                                        <input
                                            className="input"
                                            type="date"
                                            name="releaseDate"
                                            value={formData.releaseDate}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="field is-horizontal">
                            <div className="field-label is-normal">
                                <label className="label">Upload:</label>
                            </div>
                            <div className="field-body">
                                <div className="field is-grouped is-grouped-left">
                                    <div className="file is-info has-name">
                                        <label className="file-label">
                                            <input
                                                type="file"
                                                className="file-input"
                                                name="coverImage"
                                                onChange={handleImageChange}
                                            />
                                            <span className="file-cta">
                                                <span className="file-icon">
                                                    <FontAwesomeIcon icon={faUpload} />
                                                </span>
                                                <span className="file-label">
                                                    Upload an album cover
                                                </span>
                                            </span>
                                            <span className="file-name">
                                                {formData.coverImageName}
                                            </span>
                                        </label>
                                    </div>
                                </div>
                                <div className="field is-grouped is-grouped-right">
                                    <div className="control">
                                        <input className="button is-link" type="submit" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="field is-horizontal">
                            <div className="field-label is-normal"></div>
                            <div className="field-body">
                                <div className="field is-grouped is-grouped-left">
                                    <a className="button is-primary" href={`https://album-cover-search.alecvanlandingham.com?artistParam=${formData.artist}&albumParam=${formData.title}`} target="_blank">
                                        New! Album Cover Search (New Tab)
                                    </a>
                                </div>
                                <div className="field is-grouped is-grouped-right">
                                    {isSubmitting && <div>Loading...</div>}
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}

export default EditAlbum