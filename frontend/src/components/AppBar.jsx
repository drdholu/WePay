import React from 'react';
import { NavLink } from 'react-router-dom'; // Import NavLink from react-router-dom

export const Appbar = () => {
    return (
        <div className="shadow h-14 flex justify-between">
            <div className="flex flex-row justify-center items-center h-full ml-4">
                <div>WePay</div>
                {/* Add navigation links */}
                <NavLink to="/" className="ml-4 text-gray-600 hover:text-gray-900">
                    Dashboard
                </NavLink>
                <NavLink to="/send" className="ml-4 text-gray-600 hover:text-gray-900">
                    Send money
                </NavLink>
                <NavLink to="/signin" className="ml-4 text-gray-600 hover:text-gray-900">
                    SignIn
                </NavLink>
                <NavLink to="/signup" className="ml-4 text-gray-600 hover:text-gray-900">
                    SignUp
                </NavLink>
            </div>
            <div className="flex">
                <div className="flex flex-col justify-center h-full mr-4">
                    Hello User!
                </div>
                <div className="rounded-full h-12 w-12 bg-slate-200 flex justify-center mt-1 mr-2">
                    <div className="flex flex-col justify-center h-full text-xl">
                        U
                    </div>
                </div>
            </div>
        </div>
    );
};
