/* eslint-disable react/jsx-no-duplicate-props */
/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import Header from "../Header";
import Sidebar from "../Sidebar";
import { favicon, imagesend } from "../imagepath";
import { DatePicker} from "antd";
import FeatherIcon from "feather-icons-react";
import { Link } from "react-router-dom";

const EditCCHeading = () => {
    const [show, setShow] = useState(false); // Define show state variable

    const onChange = (date, dateString) => {
        // console.log(date, dateString);
      };
      const loadFile = (event) => {
        // Handle file loading logic here
      };

  return (
    <div>
      <Header />
      <Sidebar
        id="menu-item4"
        id1="menu-items4"
        activeClassName="edit-heroSection"
      />
      <>
        <div className="page-wrapper">
          <div className="content">
            {/* Page Header */}
            <div className="page-header">
              <div className="row">
                <div className="col-sm-12">
                  <ul className="breadcrumb">
                    <li className="breadcrumb-item">
                      <Link to="/landingpage/coursecontentheading">Landing Page </Link>
                    </li>
                    <li className="breadcrumb-item">
                      <i className="feather-chevron-right">
                        <FeatherIcon icon="chevron-right" />
                      </i>
                    </li>
                    <li className="breadcrumb-item active">
                      <Link to="/landingpage/coursecontentheading">Course Content Heading</Link>
                    </li>
                    <li className="breadcrumb-item">
                      <i className="feather-chevron-right">
                        <FeatherIcon icon="chevron-right" />
                      </i>
                    </li>
                    <li className="breadcrumb-item active">Edit Course Content Heading</li>
                  </ul>
                </div>
              </div>
            </div>
            {/* /Page Header */}
            <div className="row">
              <div className="col-sm-12">
                <div className="card">
                  <div className="card-body">
                    <form>
                      <div className="row">
                        <div className="col-12">
                          <div className="form-heading">
                            <h4>Course Content Heading Details</h4>
                          </div>
                        </div>
  {/* Title */}
                     <div className="col-12 col-md-6 col-xl-6">
                          <div className="form-group local-forms">
                            <label>
                              Title <span className="login-danger">*</span>
                            </label>
                            <input
                              className="form-control"
                              type="text"
                              defaultValue="Stephen"
                            />
                          </div>
                          </div>
                        {/* SubTitle */}

                      
                        <div className="col-12 col-md-6 col-xl-6">
                          <div className="form-group local-forms">
                            <label>
                              Subtitle <span className="login-danger">*</span>
                            </label>
                            <input
                              className="form-control"
                              type="text"
                              defaultValue="Bruklin"
                            />
                          </div>
                        </div>
                        </div>
                     
                     
                     {/* Description */}
                        <div className="col-12 col-sm-12">
                          <div className="form-group local-forms">
                            <label>
                            Description <span className="login-danger">*</span>
                            </label>
                            <textarea
                              className="form-control"
                              rows={3}
                              cols={30}
                              defaultValue={
                                "101, Elanxa Apartments, 340 N Madison Avenue"
                              }
                            />
                          </div>
                        </div>

                        {/* Image Upload */}
                        <div className="col-12 col-md-6 col-xl-6">
                          <div className="form-group local-top-form">
                            <label className="local-top">
                              Image <span className="login-danger">*</span>
                            </label>
                            <div className="settings-btn upload-files-avator">
                              <input
                                type="file"
                                accept="image/*"
                                name="image"
                                id="file"
                                onChange={loadFile}
                                className="hide-input"
                              />
                                 <label htmlFor="file" className="upload">
                                Choose File
                              </label>
                            </div>
                            <div
                              className="upload-images upload-sizee"
                              style={{ display: show ? "none" : "block" }}
                            >
                              <img src={favicon} alt="Image" />
                              <Link to="#" className="btn-icon logo-hide-btn">
                                <i
                                  className="feather-x-circle"
                                  onClick={() => setShow((s) => !s)}
                                >
                                  <FeatherIcon icon="x-circle" />
                                </i>
                              </Link>
                            </div>
                          </div>
                          </div>

{/* Submit and Cancel Button Button */}
                        <div className="col-12">
                          <div className="doctor-submit text-end">
                            <button
                              type="submit"
                              className="btn btn-primary submit-form me-2"
                            >
                              Submit
                            </button>
                            <button
                              type="submit"
                              className="btn btn-primary cancel-form"
                            >
                              Cancel
                            </button>
                         
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
         
        </div>
       
      </>
    </div>
  );
};

export default EditCCHeading;
