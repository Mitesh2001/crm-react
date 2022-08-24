import React from "react";
import { useSelector } from "react-redux";
import { Link } from 'react-router-dom';
import { useSubheader } from "../../_metronic/layout";
import EditIcon from '@material-ui/icons/Edit';
import App from '../Configs/app';
import { toAbsoluteUrl } from "../../_metronic/_helpers";

const Profile = () => {
    const suhbeader = useSubheader();
    suhbeader.setTitle("My Profile");
    
    const { user } = useSelector(state => state.auth);

    const picture = user.picture && user.picture !== '' ? App.assetUrl + user.picture : toAbsoluteUrl("/media/users/default.jpg");

    return (
        <div className="row gutters-sm">
            <div className="col-md-4 mb-3">
                <div className="card">
                    <div className="card-body">
                        <div className="d-flex flex-column align-items-center text-center">
                            <img src={picture} alt={user.name} className="rounded-circle" width="150" />
                            <div className="mt-3">
                                <h4>{user.name}</h4>
                                {user?.designation && <p className="text-secondary mb-1">{user?.designation}</p>}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="card mt-3">
                    <ul className="list-group list-group-flush">
                        <li className="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                            <h6 className="mb-0"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-globe mr-2 icon-inline"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>Website</h6>
                            <span className="text-secondary"><a style={{textDecoration:"none"}}href={user?.website}>{user?.website}</a></span>
                        </li>
                        <li className="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                            <h6 className="mb-0"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-facebook mr-2 icon-inline text-primary"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>Facebook</h6>
                            <span className="text-secondary"><a style={{textDecoration:"none"}}href={user?.facebook}>{user?.facebook}</a></span>
                        </li>
                        <li className="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                            <h6 className="mb-0"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-twitter mr-2 icon-inline text-info"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>Twitter</h6>
                            <span className="text-secondary"><a style={{textDecoration:"none"}}href={user?.twitter}>{user?.twitter}</a></span>
                        </li>
                        <li className="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                            <h6 className="mb-0"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-instagram mr-2 icon-inline text-danger"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>Instagram</h6>
                            <span className="text-secondary"><a style={{textDecoration:"none"}}href={user?.instagram}>{user?.instagram}</a></span>
                        </li>
                    </ul>
                </div>
            </div>
            <div className="col-md-8">
                <div className="card mb-3">
                    <div className="card-body p-5">
                        <div className="row">
                            <div className="col-sm-12 text-right">
                                <Link to="/update-profile" className="btn btn-primary rk-btn"><EditIcon /> EDIT PROFILE</Link>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-sm-3">
                                <h6 className="mb-0">Full Name</h6>
                            </div>
                            <div className="col-sm-9 text-secondary">{user.name}</div>
                        </div>
                        <hr />
                        <div className="row">
                            <div className="col-sm-3">
                                <h6 className="mb-0">Email</h6>
                            </div>
                            <div className="col-sm-9 text-secondary">{user.email}</div>
                        </div>
                        <hr />
                        <div className="row">
                            <div className="col-sm-3">
                                <h6 className="mb-0">Mobile</h6>
                            </div>
                            <div className="col-sm-9 text-secondary">{user?.mobileno}</div>
                        </div>
                        <hr />
                        <div className="row">
                            <div className="col-sm-3">
                                <h6 className="mb-0">Additional Contact No.</h6>
                            </div>
                            <div className="col-sm-9 text-secondary">{user?.alt_mobileno}</div>
                        </div>
                        <hr />
                        <div className="row">
                            <div className="col-sm-3">
                                <h6 className="mb-0">Address Line 1</h6>
                            </div>
                            <div className="col-sm-9 text-secondary">
                                {user?.address_line_1}
                            </div>
                        </div>
                        <hr />
                        <div className="row">
                            <div className="col-sm-3">
                                <h6 className="mb-0">Address Line 2</h6>
                            </div>
                            <div className="col-sm-9 text-secondary">
                                {user?.address_line_2}
                            </div>
                        </div>
                        <hr />
                        <div className="row">
                            <div className="col-sm-3">
                                <h6 className="mb-0">City</h6>
                            </div>
                            <div className="col-sm-9 text-secondary">
                                {user?.city}
                            </div>
                        </div>
                        <hr />
                        <div className="row">
                            <div className="col-sm-3">
                                <h6 className="mb-0">Pincode</h6>
                            </div>
                            <div className="col-sm-9 text-secondary">
                                {user?.pincode}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;