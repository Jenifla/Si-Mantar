// Topbar.js
import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import { faBars, faSearch, faExclamationTriangle, faCheckCircle, faTimesCircle, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import avatar from "../assets/images.png";
import axios from 'axios';
import Pusher from 'pusher-js';
import "../Data Peminjaman/Dashboard.css";

function Topbar({ toggleSidebar, onSearch }) {
    const [searchTerm, setSearchTerm] = useState('');
    const modalRef = useRef(null);

    const handleSearch = () => {
        onSearch(searchTerm);
    };

    const [count, setCount] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        const pusher = new Pusher('85d3cf12b17090f0f933', {
            cluster: 'ap1',
            encrypted: true,
            auth: {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}` // Atau metode autentikasi lain
                }
            }
        });

        const channel = pusher.subscribe('simantar-pusher');
        channel.bind('NewNotification', data => {
            fetchNotificationCount(); // Refresh notifications on update
        });

        fetchNotificationCount(); // Fetch initial notifications

        return () => {
            channel.unbind_all();
            channel.unsubscribe();
        };
    }, []);

    useEffect(() => {
        if (showModal) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showModal]);

    const handleClickOutside = (event) => {
        if (modalRef.current && !modalRef.current.contains(event.target)) {
            setShowModal(false);
        }
    };

    const fetchNotificationCount = async () => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/peminjamans/getif`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}` // Sesuaikan dengan cara Anda mengatur token
                }
            });

            const { notifications } = response.data;
            const flattenedNotifications = notifications.flat(); // Flatten array notifikasi jika perlu
            
            setCount(flattenedNotifications.length);
            setCartItems(flattenedNotifications);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };
    
    const getNotificationIcon = (type) => {
        switch (type) {
            case 'success':
                return { icon: faCheckCircle, style: { color: 'green', marginRight: '10px', fontSize: '44px' } };
            case 'error':
                return { icon: faTimesCircle, style: { color: 'red', marginRight: '10px', fontSize: '44px' } };
            case 'warning':
                return { icon: faExclamationTriangle, style: { color: 'red', marginRight: '10px', fontSize: '44px' } };
            case 'info':
            default:
                return { icon: faInfoCircle, style: { color: 'blue', marginRight: '10px', fontSize: '44px' } };
        }
    };
    
    

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleOpenModal = () => {
        setShowModal(true);
    };

    return (
        <div className="topbar">
            <div className="toggle" onClick={toggleSidebar}>
                <FontAwesomeIcon icon={faBars} />
            </div>
            <div className="search">
                <label>
                    <input type="text" placeholder="Search here" value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)} />
                    <FontAwesomeIcon className="icon" icon={faSearch} onClick={handleSearch} />
                </label>
            </div>
            <div className="user-notification">
                <div className="notification-bell" onClick={handleOpenModal}>
                    <svg className="bell-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="48" height="48">
                        <path d="M12 2C7.03 2 3 6.03 3 11v5.42l-1.71 1.71A.996.996 0 0 0 2 20h20a.996.996 0 0 0 .71-1.71L21 16.42V11c0-4.97-4.03-9-9-9zm-1 19c0 .55.45 1 1 1s1-.45 1-1h-2z" fill="none" stroke="black" strokeWidth="2" />
                    </svg>
                    {count > 0 && <span className="notification-count">{count}</span>}
                    {showModal && (
                <div className="custom-modal" style={{ right: '0px', top: '60px' }}>
                    <div ref={modalRef} className="modal-content" style={{ borderRadius: '15px' }}>
                       
                        {cartItems.map((item, index) => (
                            <div key={index} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-around', padding: '10px', borderRadius: '20%' }}>
                                <div style={{ display: 'flex', alignItems: 'center', }}>
                                <FontAwesomeIcon icon={getNotificationIcon(item.type).icon} style={getNotificationIcon(item.type).style}/>
                                    <div>
                                        <strong>{item.name}</strong>
                                        <br />
                                        {item.description}
                                    </div>
                                </div>
                                {index < cartItems.length - 0 && <hr style={{ width: '100%', borderTop: '3px solid #A09E9E', margin: '0px 0' }} />}
                            </div>
                        ))}
                    </div>
                </div>
            )}
                </div>
                
                <div className="user">
                <Link to="/pengaturan">
                    <img src={avatar} alt="Avatar" />
                </Link>
                </div>
            </div>
            
        </div>
    );
}

export default Topbar;
