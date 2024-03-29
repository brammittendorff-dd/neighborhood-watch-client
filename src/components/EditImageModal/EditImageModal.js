import React from 'react'
import Spinner from '../Spinner/Spinner'
import config from '../../config'
import MainContext from '../../contexts/MainContext'
import TokenService from '../../services/token-service'
import userIcon from '../../app-images/user icon.png'

export default class EditProfileImage extends React.Component {
    static contextType = MainContext
    static defaultProps = {
        updateProfileImage: () => {

        },
        showImageModal: false,
        handleHideImageModal: () => {
            
        }
    }


    state = {
        image: null,
        uploading: false,
    }

    componentDidMount () {

        return fetch(`${config.API_ENDPOINT}/users/profile`, {
            method: 'GET',
            headers: {
                'content-type': 'application/json',
                'authorization': `bearer ${TokenService.getAuthToken()}`
            }
        })
        .then(res => {
            if (!res.ok) {
                return res.json().then(e => Promise.reject(e))
            }
            return res.json()
        })
        .then(responseJson => {
            console.log('get response', responseJson)
            this.setState({
                image: responseJson.image
            })
        })
        
    }   

   
    handleImageSubmit = (e) => {
        e.preventDefault()
        const { updateProfileImage } = this.props
        
        this.setState({
            uploading: true
        })

        console.log('event target', e.target['image'].files[0])

        let formData = new FormData()

        formData.append('image', e.target['image'].files[0])

        return fetch(`${config.API_ENDPOINT}/users/profile`, {
            method: 'PATCH',
            headers: {
                'authorization': `bearer ${TokenService.getAuthToken()}`
            },
            body: formData
        })
        .then(res => {
            if (!res.ok) {
                return res.json().then(e => Promise.reject(e))
            }
            return res.json()
        })
        .then(responseJson => {
             console.log('patch responsejson', responseJson)
            this.setState({
                uploading: false,
                image: responseJson.image
            }, () => updateProfileImage(responseJson))
        })
    }
    // showCommentModal = () => {
    //     document.body.style.overflowY = 'hidden'
    //     this.setState({
    //         showCommentForm: true
    //     })
    // }

    hideCommentModal = () => {
        document.body.style.overflowY = 'auto'
        this.setState({
            showCommentForm: false,
            uploading: false
        })
    }

    handleImageChange = (e) => {
        this.setState({
            image: URL.createObjectURL(e.target.files[0])
        })
    }

    render () {

        const { uploading, image } = this.state
        // const showHideClassName = showCommentForm ? 'modal display-block' : 'modal display-none'
        const { showImageModal, handleHideImageModal } = this.props

        return (
            <section>
                {uploading ? (
                    <div>
                        <Spinner />
                    </div>
                ) : (
                    <div>
                         {showImageModal ? (
                            <div className='modal display-block'>
                                <section className='modal-main'>
                                    <form onSubmit={this.handleImageSubmit}>
                                        <button type='button' onClick={handleHideImageModal}>
                                            <span className="fas fa-times" aria-hidden="true"></span>
                                        </button>
                                        <div className='AddPost__formDiv'>
                                                {!image ? 
                                                    <label htmlFor="image" className='LoginForm__signupLabel'>
                                                        <img className='user__image' src={userIcon} alt='user-icon' width='200'/>
                                                        <p className='image-text'>
                                                            Add a Photo
                                                        </p>
                                                    </label> 
                                                : 
                                                    <label htmlFor="image" className='LoginForm__signupLabel'>
                                                        <img className='user__image' src={image} alt='user-icon' width='200'/>
                                                        <p className='image-text'>
                                                            Add a Photo
                                                        </p>
                                                    </label>
                                                }
                                        </div>
                                        <input type='file' id='image' name='image' onChange={this.handleImageChange} />
                                        <button type='submit'>Submit Profile Picture</button>
                                    </form>
                                </section> 
                            </div>
                         ) : null}
                    </div>
                )}
            </section>
        )
    }
}