import React, { useEffect } from 'react'
import style from './styles/catalog.css'
import { useState } from 'react'

import QuizPreview from '../Components/QuizPreview'
import CreateQuizPopup from '../Components/CreateQuizPopup'

import useApiPrivate from '../Hooks/useApiPrivate'
import { RotatingLines } from 'react-loader-spinner'
import { useNavigate } from 'react-router-dom'

import { CgMenuGridO, CgRowFirst } from 'react-icons/cg'
import { BiArrowFromLeft, BiArrowToBottom, BiArrowToTop, BiCalendarMinus, BiCalendarPlus, BiDotsVertical } from 'react-icons/bi'
import { BsDot } from 'react-icons/bs'
import { FaDotCircle } from 'react-icons/fa'
import { GiNewBorn } from 'react-icons/gi'
import { GrNew } from 'react-icons/gr'
import { GoDot } from 'react-icons/go'
import { FaOldRepublic } from 'react-icons/fa6'
import { MdDataExploration } from 'react-icons/md'




const EditorPage = () => {

    const navigate = useNavigate()

    const api = useApiPrivate()
    const [loading, setLoading] = useState(true)

    const [layout, setLayout] = useState(localStorage.getItem('CatalogLayout') || 'row')
    const [createPopup, setCreatePopup] = useState(false)
    const [quizes, setQuizes] = useState([]);

    const [search, setSearch] = useState('')

    const [sort, setSort] = useState(localStorage.getItem('CatalogSort') || 'default')


    const UpdateQuizes = async () => {
        setLoading(true);
        const data = (await api.get('/api/quizes')).data

        setQuizes(prev => data);
        setLoading(false);
    }



    useEffect(() => {

        UpdateQuizes();
    }, [])

    const changeLayout = (newlayout) => {
        setLayout(prev => { return newlayout })
        localStorage.setItem('CatalogLayout', newlayout)
    }
    const changeSort = (newsort) => {
        setSort(prev => newsort)
        localStorage.setItem('CatalogSort', newsort)
    }

    const showCreatePopup = (show) => {
        setCreatePopup(prev => show)
    }

    const createNewQuiz = async (title) => {
        const data = await api.post('/api/quiz/create', {
            title
        })
        await UpdateQuizes();
    }

    const showQuizes = () => {
        let sorted = [...quizes];

        function comapreFn(a, b) {
            if (sort === 'newest') return new Date(a.created).getDate() < new Date(b.created).getDate();
            else if (sort === 'oldest') return new Date(a.created).getDate() > new Date(b.created).getDate();
            else if (sort === 'abcup') return a.title < b.title;
            else if (sort === 'abcdown') return a.title > b.title;

            return 0;
        }

        sorted = sorted.sort(comapreFn);


        return sorted.map((item) => {
            if (String(item.title).includes(search))
                return (<QuizPreview key={item._id} urlid={item.urlid} title={item.title} status={item.private ? 'Private' : 'Open'} created={new Date(item.created).toLocaleDateString()} updated={new Date(item.updated).toLocaleDateString()} />)
        })
    }


    return (
        <>

            {(createPopup) ? (<CreateQuizPopup Show={showCreatePopup} Create={createNewQuiz} isShow={showCreatePopup} />)  : ''}

            <div style={style} className="catalog-container">
                <div className="catalog-options">
                    <div className="search">
                        <input className="search-input" type="text" placeholder="serch..." defaultValue={search} onChange={(e) => setSearch(prev => e.target.value)} />
                        <button type='button' className="search-button" >
                            ⌕
                        </button>
                    </div>
                    <div className="tools">
                        <div className="create" onClick={showCreatePopup}>Create New Quiz</div>
                        <div className="dropdown">
                            <p>Sort</p>
                            <div className="dropdown-content">
                                <div className="dropdown-item" onClick={() => changeSort('deafult')}> <BsDot size={20}></BsDot> <p style={{ fontWeight: (sort === 'default') ? '900' : '500' }}>Default</p></div>
                                <div className="dropdown-item" onClick={() => changeSort('newest')}> <BiCalendarPlus size={20}></BiCalendarPlus> <p>Newest</p></div>
                                <div className="dropdown-item" onClick={() => changeSort('oldest')}> <BiCalendarMinus size={20}></BiCalendarMinus> <p>Oldest</p></div>
                                <div className="dropdown-item" onClick={() => changeSort('abcdown')}> <BiArrowToTop size={20}></BiArrowToTop> <p>Alphabet</p></div>
                                <div className="dropdown-item" onClick={() => changeSort('abcup')}> <BiArrowToBottom size={20}></BiArrowToBottom> <p>Alphabet</p></div>
                            </div>
                        </div>
                        <div className="dropdown">
                            <p>Layout</p>
                            <div className="dropdown-content">
                                <div className="dropdown-item" onClick={() => { changeLayout('box') }} > <CgMenuGridO size={20}></CgMenuGridO> <p>Box</p></div>
                                <div className="dropdown-item" onClick={() => { changeLayout('row') }} > <CgRowFirst size={20}></CgRowFirst> <p>Row</p></div>
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

                <div className={'tests ' + layout} >

                    {!loading ? showQuizes()
                        :
                        <div style={{
                            display: 'flex',
                            margin: 'auto',
                        }}
                        
                        >

                            <RotatingLines />
                        </div>
                    }

                </div>

            </div>
        </>
    )
}

export default EditorPage
