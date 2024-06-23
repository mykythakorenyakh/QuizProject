import { NavLink, Outlet } from 'react-router-dom'
import { RiLogoutBoxRLine } from "react-icons/ri";

const Header = () => {


    return (
        <>
            <header>
                <div className="logo">
                    <img src="" />
                </div>
                <div className="navs">
                    <NavLink to='/account' className={({ isActive, isPending }) => isPending ? "nav" : isActive ? "nav index" : "nav" }>
                        Account
                    </NavLink>
                <NavLink to='/editor' className={({ isActive, isPending }) => isPending ? "nav" : isActive ? "nav index" : "nav" }>Editor</NavLink>
                <NavLink to='/notifications' className={({ isActive, isPending }) => isPending ? "nav" : isActive ? "nav index" : "nav" }>Notifications</NavLink>
                <div className="nav"><RiLogoutBoxRLine size={30}/></div>
            </div>
        </header >
            <Outlet />
        </>

    )
}

export default Header
