import React from 'react'
import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUpload } from '@fortawesome/free-solid-svg-icons'
import axios from 'axios'
import apiBasePath from './globalVars'


function AddAlbum() {

    const personid = localStorage.getItem('personid')

    const navigate = useNavigate()

    const logout = personid => {if(personid === 'null') {navigate('/login')}}
    useEffect(() => logout(personid),[])

    const [formData, setFormData] = useState(
        {
            artist: '',
            title: '',
            genre: '',
            recordLabel: '',
            releaseDate: '',
            coverImage: '',
            coverImageName: '',
            addedby: personid
        }
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
        let formDataObj = new FormData()
        
        formDataObj.append('artist',formData.artist)
        formDataObj.append('title',formData.title)
        formDataObj.append('genre',formData.genre)
        formDataObj.append('recordLabel',formData.recordLabel)
        formDataObj.append('releaseDate',formData.releaseDate)
        formDataObj.append('addedby',formData.addedby)
        formDataObj.append('coverImage',formData.coverImage)
        axios.post(
            apiBasePath + '/addalbum',
            formDataObj,
            {
                headers: {
                    "Content-Type": 'multipart/form-data'
                }
            } 
        )
            .then(
                () => {
                    var confirm = window.confirm('Album added')
                    confirm ?
                        navigate('/')
                    : void (0)
                }
            )
            .catch(
                err => {
                    console.log(err)
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
                        <h1>Add Album</h1>
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
                                <div className="field">
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
                                                required
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
                    </form>
                </div>
            </div>
        </>
    )
}

export default AddAlbum