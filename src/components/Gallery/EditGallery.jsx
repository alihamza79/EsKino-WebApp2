/* eslint-disable react/jsx-no-duplicate-props */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import Header from "../Header";
import Sidebar from "../Sidebar";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button, Select, message } from "antd";
import FeatherIcon from "feather-icons-react";
import { uploadFile } from "../../services/storageService";
import { getDocument, updateDocument } from "../../services/dbService";

const EditGallery = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get("id");
  const [fileList, setFileList] = useState([]);
  const [category, setCategory] = useState("Events");
  const [uploading, setUploading] = useState(false);
  const [existingImageUrl, setExistingImageUrl] = useState("");

  useEffect(() => {
    fetchGalleryItem();
  }, []);

  const fetchGalleryItem = async () => {
    try {
      const doc = await getDocument("gallery", id);
      if (doc.exists) {
        const data = doc.data();
        setCategory(data.category);
        setExistingImageUrl(data.url);
      } else {
        message.error("Gallery item not found");
      }
    } catch (error) {
      console.error("Error fetching gallery item:", error);
    }
  };

  const handleFileChange = (event) => {
    const files = event.target.files;
    setFileList([...files]);
  };

  const handleCategoryChange = (value) => {
    setCategory(value);
  };

  const handleUpdate = async (event) => {
    event.preventDefault();
    setUploading(true);

    let imageUrl = existingImageUrl;

    if (fileList.length > 0) {
      const file = fileList[0];
      try {
        imageUrl = await uploadFile(file, `images/${file.name}`);
      } catch (error) {
        message.error("Image upload failed: " + error.message);
        setUploading(false);
        return;
      }
    }

    try {
      await updateDocument("gallery", id, {
        url: imageUrl,
        category,
        timestamp: new Date(),
      });
      message.success("Gallery item updated successfully");
      setUploading(false);
      navigate("/gallerylist");
    } catch (error) {
      message.error("Update failed: " + error.message);
      setUploading(false);
    }
  };

  return (
    <div>
      <Header />
      <Sidebar
        id="menu-item7"
        id1="menu-items7"
        activeClassName="editgallery"
      />
      <div className="page-wrapper">
        <div className="content">
          <div className="page-header">
            <div className="row">
              <div className="col-sm-12">
                <ul className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="/gallery">Gallery</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <i className="feather-chevron-right">
                      <FeatherIcon icon="chevron-right" />
                    </i>
                  </li>
                  <li className="breadcrumb-item active">Edit Gallery</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-sm-12">
              <div className="card">
                <div className="card-body">
                  <form onSubmit={handleUpdate}>
                    <div className="row">
                      <div className="col-12">
                        <div className="form-heading">
                          <h4>Edit Gallery</h4>
                        </div>
                      </div>
                      <div className="col-12 col-md-6 col-xl-6">
                        <div className="form-group local-forms">
                          <div
                            className={
                              existingImageUrl || fileList.length > 0
                                ? "upload-files-avator"
                                : "upload-files-avator settings-btn"
                            }
                            style={{ position: "relative" }}
                          >
                            {(existingImageUrl || fileList.length > 0) && (
                              <div className="uploaded-image">
                                <img
                                  src={
                                    fileList.length > 0
                                      ? URL.createObjectURL(fileList[0])
                                      : existingImageUrl
                                  }
                                  alt="Uploaded"
                                  style={{
                                    width: "180px",
                                    height: "180px",
                                    objectFit: "cover",
                                  }}
                                />
                                <div
                                  className="edit-icon"
                                  style={{
                                    position: "absolute",
                                    backgroundColor: "white",
                                    left: 170,
                                    top: 160,
                                  }}
                                >
                                  <input
                                    type="file"
                                    accept="image/*"
                                    id="file"
                                    onChange={handleFileChange}
                                    className="hide-input"
                                    style={{ display: "none" }}
                                  />
                                  <label
                                    htmlFor="file"
                                    className="upload"
                                    style={{ cursor: "pointer" }}
                                  >
                                    <FeatherIcon icon="edit" />
                                  </label>
                                </div>
                              </div>
                            )}
                            {!existingImageUrl && fileList.length === 0 && (
                              <div>
                                <input
                                  type="file"
                                  accept="image/*"
                                  id="file"
                                  onChange={handleFileChange}
                                  className="hide-input"
                                />
                                <label
                                  htmlFor="file"
                                  className="upload"
                                  style={{ cursor: "pointer" }}
                                >
                                  Choose Files
                                </label>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="col-12 col-md-6 col-xl-6">
                        <div className="form-group local-forms">
                          <label style={{ marginTop: "-10px" }}>
                            Category <span className="login-danger">*</span>
                          </label>
                          <Select
                            value={category}
                            style={{ width: "100%" }}
                            onChange={handleCategoryChange}
                          >
                            <Select.Option value="Events">Events</Select.Option>
                            <Select.Option value="Our Team">
                              Our Team
                            </Select.Option>
                            <Select.Option value="Function">
                              Function
                            </Select.Option>
                          </Select>
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="doctor-submit text-end">
                          <Button
                            style={{ marginRight: "10px" }}
                            className="btn"
                            type="primary"
                            htmlType="submit"
                            disabled={uploading}
                            loading={uploading}
                          >
                            {uploading ? "Updating..." : "Update"}
                          </Button>
                          <Button
                            type="button"
                            className="btn cancel-form"
                            onClick={() => {
                              // Handle cancel
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditGallery;
