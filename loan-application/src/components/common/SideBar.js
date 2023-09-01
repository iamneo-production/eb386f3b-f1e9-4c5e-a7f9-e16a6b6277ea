import React from "react";
import {
    MdAccountBalance,
    MdPendingActions,
    MdAssignmentTurnedIn,
    MdGrading,
    MdAssignmentAdd,
    MdMonetizationOn,
} from "react-icons/md";
const availableSidebarComponents = [
    {
        icon: <MdGrading className="icon" />,
        label: "Loans List",
        role: "BANK_MANAGER",
        link: "/loans",
    },
    {
        icon: <MdPendingActions className="icon" />,
        label: "Pending Loans",
        role: "BANK_MANAGER",
        link: "/pending-loans",
    },
    {
        icon: <MdAssignmentTurnedIn className="icon" />,
        label: "Approved Loans",
        role: "BANK_MANAGER",
        link: "/approved-loans",
    },
    {
        icon: <MdGrading className="icon" />,
        label: "Loan applications",
        role: "LOAN_OFFICER",
        link: "/loans",
    },
    {
        icon: <MdMonetizationOn className="icon" />,
        label: "Track loan",
        role: "Customer",
        link: "/track-loan",
    },
    {
        icon: <MdAssignmentAdd className="icon" />,
        label: "Apply Loan",
        role: "Customer",
        link: "/loans",
    },
];
function SideBar({ openSidebarToggle, OpenSidebar, user }) {
    const filteredComponents = availableSidebarComponents.filter(
        (component) => component.role === user.role
    );
    return (
        <aside
            id="sidebar"
            className={openSidebarToggle ? "sidebar-responsive" : ""}
        >
            <div className="sidebar-title">
                <div className="sidebar-brand">
                    <MdAccountBalance className="icon_header" />
                    Loan App
                </div>
                <span className="icon close_icon" onClick={OpenSidebar}>
                    X
                </span>
            </div>
            <ul className="sidebar-list">
                {filteredComponents.map((component, index) => (
                    <li className="sidebar-list-item" key={index}>
                        <a href={`${component.link}/${user.id}`}>
                            {component.icon} {component.label}
                        </a>
                    </li>
                ))}
            </ul>
        </aside>
    );
}
export default SideBar;
