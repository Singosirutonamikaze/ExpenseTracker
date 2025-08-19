import React, { Component } from 'react'
import { UserContext } from '../../context/UserContext';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

class DashboardLayout extends Component {
    render() {
        const user = UserContext;
        return (
            <div className='dashboard-layout'>
                <Navbar activeMenu={this.props.activeMenu} />

                {
                    user && (
                        <div className='flex'>
                            <div className='max-[1080px]:hidden'>
                                <Sidebar activeMenu={this.props.activeMenu} />
                            </div>
                            <div className='grow mx-5'>
                                {this.props.children}
                            </div>
                        </div>
                    )
                }
            </div>
        )
    }
}

export default DashboardLayout;