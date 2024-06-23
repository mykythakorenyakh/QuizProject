import React, { useEffect } from 'react'
import style from './styles/catalog.css'
import { useState } from 'react'

import QuizPreview from '../Components/QuizPreview'
import CreateQuizPopup from '../Components/CreateQuizPopup'

import useApiPrivate from '../Hooks/useApiPrivate'
import { RotatingLines } from 'react-loader-spinner'
import { useNavigate } from 'react-router-dom'



const EditorPage = () => {

    const navigate = useNavigate()

    const api = useApiPrivate()
    const [loading,setLoading] = useState(true)

    const [layout, setLayout] = useState(localStorage.getItem('CatalogLayout') || 'row')
    const [createPopup, setCreatePopup] = useState(false)
    const [quizes,setQuizes] = useState([]);


    const UpdateQuizes = async ()=>{
        setLoading(true);
        const data = (await api.get('/api/quizes')).data

        setQuizes(prev=>data);
        setLoading(false);
    }



    useEffect(()=>{
        
        UpdateQuizes();
    },[])

    const changeLayout = (newlayout) => {
        setLayout(prev => { return newlayout })
        localStorage.setItem('CatalogLayout',newlayout)
    }

    const showCreatePopup = (show) => {
        setCreatePopup(prev => show)
    }

    const createNewQuiz = async (title)=>{
        const data = await api.post('/api/quiz/create',{
            title
        })
        await UpdateQuizes();
    }

    const showQuizes = ()=>{
        return quizes.map(item=>{
            return (<QuizPreview key={item._id} urlid={item.urlid}  title={item.title} status={item.private?'Private':'Open'} created={new Date(item.created).toLocaleDateString()} updated={new Date(item.updated).toLocaleDateString()}/>)
        })
    }


    return (
        <>

            {(createPopup)?(<CreateQuizPopup Show={showCreatePopup} Create={createNewQuiz}/>):''}

            <div style={style} className="catalog-container">
                <div className="catalog-options">
                    <div className="search">
                        <input className="search-input" type="text" placeholder="serch..." defaultValue='' />
                        <button type='button' className="search-button">
                            ⌕
                        </button>
                    </div>
                    <div className="tools">
                        <div className="create" onClick={showCreatePopup}>Create New Quiz</div>
                        <div className="dropdown">
                            <p>Sort</p>
                            <div className="dropdown-content">
                                <div className="dropdown-item"><img src="https://cdn-icons-png.flaticon.com/256/2066/2066721.png" /> <p>Newest</p></div>
                                <div className="dropdown-item"><img src="https://cdn-icons-png.flaticon.com/256/2066/2066721.png" /> <p>Oldest</p></div>
                                <div className="dropdown-item"><img src="https://cdn-icons-png.flaticon.com/256/2066/2066721.png" /> <p>Alphabet ↑</p></div>
                                <div className="dropdown-item"><img src="https://cdn-icons-png.flaticon.com/256/2066/2066721.png" /> <p>Alphabet ↓</p></div>
                            </div>
                        </div>
                        <div className="dropdown">
                            <p>Layout</p>
                            <div className="dropdown-content">
                                <div className="dropdown-item" onClick={() => { changeLayout('box') }} ><img src="https://cdn-icons-png.flaticon.com/256/2066/2066721.png" /> <p>Box</p></div>
                                <div className="dropdown-item" onClick={() => { changeLayout('row') }} ><img src="https://cdn-icons-png.flaticon.com/256/2066/2066721.png" /> <p>Row</p></div>
                            </div>
                        </div>
                    </div>
                </div>


                {(layout === 'row') ?
                    (<div className="row-header">
                        <div className="param">Name</div>
                        <div className="param">Status</div>
                        <div className="param">Created</div>
                        <div className="param">Updated</div>
                    </div>) : ''
                }

                <div className={'tests ' + layout}>


                    {!loading?showQuizes():<RotatingLines/>}


                </div>

            </div>
        </>
    )
}

export default EditorPage
