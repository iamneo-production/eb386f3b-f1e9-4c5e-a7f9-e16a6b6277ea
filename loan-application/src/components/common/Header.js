import React from "react";
import { BsFillBellFill, BsPersonCircle, BsJustify } from "react-icons/bs";
import { FaSignOutAlt } from "react-icons/fa";
function Header({ OpenSidebar, user }) {
    return (
        <header className="header">
            <div className="menu-icon">
                <BsJustify className="icon" onClick={OpenSidebar} />
            </div>
            <div className="header-left">Hello {user.name}!</div>
            <div className="header-right">
                <a href="/" title="notifications">
                    <BsFillBellFill className="icon" />
                </a>
                <a href="/" title="profile">
                    <BsPersonCircle className="icon" />
                </a>
                <a href="/" title="logout">
                    <FaSignOutAlt className="icon" />
                </a>
            </div>
        </header>
    );
}
export default Header;