import React, { Component } from 'react';
import { HiOutlineMenu, HiOutlineX } from 'react-icons/hi';
import Sidebar from './Sidebar';


class Navbar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            openSideMenu: false,
        };
    }
    render() {
        const openSideMenu = this.state.openSideMenu;
        return (
            <div className=' flex gap-5 bg-white border border-b border-gray-200/50 backdrop-blur-[2px] px-7 py-4 sticky top-0 z-50'>
                <button
                    className='lg:hidden text-2xl text-gray-900 hover:text-gray-600 transition-all duration-300'
                    onClick={
                        () =>
                            this.setState(
                                {
                                    openSideMenu: !openSideMenu
                                }
                            )
                    }

                >
                    {openSideMenu ?
                        (
                            <HiOutlineX className='text-2xl text-gray-900 hover:text-gray-600 transition-all duration-300'/>
                        ) : (
                            <HiOutlineMenu className='text-2xl text-gray-900 hover:text-gray-600 transition-all duration-300'/>
                        )
                    }
                </button>

                <h2 className='text-lg text-gray-900 font-medium'>
                    Expense Tracker
                </h2>

                {
                    openSideMenu && (
                        <div className='fixed top-[61px] -ml-4 bg-white shadow-lg rounded-[2px] z-50'>
                            <Sidebar activeMenu={this.props.activeMenu} />
                        </div>
                    )
                }
            </div>
        )
    }
}

export default Navbar;