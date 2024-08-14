import { NavLink, Outlet } from 'react-router-dom'
import { RiLogoutBoxRLine } from "react-icons/ri";

import useLogout from '../Hooks/useLogout';
import { GiClassicalKnowledge, GiGiftOfKnowledge } from 'react-icons/gi';

const Header = () => {
    const logout = useLogout();

    return (
        <>
            <header>
                <div className="logo">
                    <GiClassicalKnowledge size={75} ></GiClassicalKnowledge>
                </div>
                <div className="navs">
                    <NavLink to='/account' className={({ isActive, isPending }) => isPending ? "nav" : isActive ? "nav index" : "nav"}>
                        Account
                    </NavLink>
                    <NavLink to='/editor' className={({ isActive, isPending }) => isPending ? "nav" : isActive ? "nav index" : "nav"}>Editor</NavLink>
                    <div className="nav" onClick={()=>logout()}><RiLogoutBoxRLine size={30} /></div>
                </div>
            </header >
            <Outlet />
        </>

    )
}

export default Header
