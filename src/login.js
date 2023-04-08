import Axios from 'axios'
import { useState }  from 'react'
import { useNavigate } from 'react-router-dom'
import apiBasePath from './globalVars'

function Login() {

    const navigate = useNavigate()

    const [input, setInput] = useState()

    const handleChange = event => setInput(event.target.value)

    const handleSubmit = event => {
        event.preventDefault()
        Axios.get(apiBasePath + '/getlogin/' + input)
            .then(
                res => {
                    localStorage.setItem('personid', JSON.stringify(res.data.personid))
                    navigate('/')
                }
            )
            .catch(err => console.log(err))
    }

    const demoMode = () => {
        localStorage.setItem('personid', JSON.stringify(-1))
        navigate('/')
    }

    return (
        <>
            <section className="section has-background-link-dark">
                <div className="columns is-centered">
                    <div className="column"></div>
                    <div className="column is-half has-text-centered">
                        <h1 className="title is-1 has-text-white">Albums of the Year</h1>
                    </div>
                    <div className="column"></div>
                </div>
            </section>
            <div className="container">
                <div className="box">
                    <div className="form">
                        <div className="field">
                            <label className="label">Enter code:</label>
                            <div className="control">
                                <input className="input" type="text" onChange={handleChange}></input>
                            </div>
                        </div>

                        <div className="field is-grouped">
                            <p className="control">
                                <a className="button" onClick={handleSubmit}>Login</a>
                            </p>
                            <p className="control">
                                <a className="button" onClick={demoMode}>Use demo mode (recruiters click here)</a>
                            </p>
                        </div>

                    </div>
                </div>
            </div>
        </>
    )
}

export default Login