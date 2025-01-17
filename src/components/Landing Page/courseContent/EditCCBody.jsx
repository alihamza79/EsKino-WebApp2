import React, { useState, useEffect } from "react";
import Header from "../../Header";
import Sidebar from "../../Sidebar";
import { Link, useNavigate, useParams } from "react-router-dom";
import FeatherIcon from "feather-icons-react";
import { imagesend } from "../../imagepath";
import { getDocument, updateDocument } from "../../../services/dbService";
import ImageUpload from "../ImageUpload"; // Import the ImageUpload component
import { uploadFile } from "../../../services/storageService";
import { toast, ToastContainer } from "react-toastify";
const EditCCBody = () => {
    const { id } = useParams(); // Retrieve the document ID from the URL
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        CCTitle: "",
        CCQuote: "",
        CCDescription: "",
        CCImage: "",
    });

    useEffect(() => {
        const fetchDocumentData = async () => {
            try {
                const documentSnapshot = await getDocument('CourseContentBody', id);
                if (documentSnapshot.exists()) {
                    const documentData = documentSnapshot.data();
                    setFormData(documentData);
                } else {
                    console.error('Document does not exist');
                }
            } catch (error) {
                console.error('Error fetching document data:', error);
            }
        };

        fetchDocumentData();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            await updateDocument('CourseContentBody', id, formData);
            sessionStorage.setItem('updateCCBodySuccess', 'true'); // Set update flag
            navigate("/landingpage/coursecontentbody");
        } catch (error) {
            toast.error("Error updating document: " + error.message, { autoClose: 2000 });
            console.error('Error updating document:', error);
        }
        setLoading(false);
    };

    const loadFile = async (event) => {
        const file = event.target.files[0];

        if (file) {
            const toastId = toast.loading("Uploading image...");
            try {
                const uploadedImageURL = await uploadFile(file, `Images/${file.name}`, (progress) => {
                    const percent = Math.round((progress.loaded / progress.total) * 100);
                    toast.update(toastId, { render: `Uploading image... ${percent}%`, type: "info", isLoading: true });
                });
                setFormData((prevData) => ({
                    ...prevData,
                    CCImage: uploadedImageURL
                }));
                toast.update(toastId, { render: "Image uploaded successfully!", type: "success", isLoading: false, autoClose: 2000 });
            } catch (error) {
                toast.update(toastId, { render: "Image upload failed: " + error.message, type: "error", isLoading: false, autoClose: 2000 });
            }
        }
    };

    return (
        <div>
            <Header />
            <Sidebar
                id="menu-item4"
                id1="menu-items4"
                activeClassName="edit-appoinment"
            />
            <div className="page-wrapper">
                <div className="content">
                    <div className="page-header">
                        <div className="row">
                            <div className="col-sm-12">
                                <ul className="breadcrumb">
                                    <li className="breadcrumb-item">
                                        <Link to="/landingpage/coursecontentbody">Landing Page </Link>
                                    </li>
                                    <li className="breadcrumb-item">
                                        <i className="feather-chevron-right">
                                            <FeatherIcon icon="chevron-right" />
                                        </i>
                                    </li>
                                    <li className="breadcrumb-item active">
                                        <Link to="/landingpage/coursecontentbody">Course Content Body</Link>
                                    </li>
                                    <li className="breadcrumb-item">
                                        <i className="feather-chevron-right">
                                            <FeatherIcon icon="chevron-right" />
                                        </i>
                                    </li>
                                    <li className="breadcrumb-item active">Edit Course Content Body</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="card">
                                <div className="card-body">
                                    <form onSubmit={handleSubmit}>
                                        <div className="row">
                                            <div className="col-12">
                                                <div className="form-heading">
                                                    <h4>Edit Course Content Body</h4>
                                                </div>
                                            </div>
                                            {/* Title */}
                                            <div className="col-12 col-md-6 col-xl-6">
                                                <div className="form-group local-forms">
                                                    <label>Title <span className="login-danger">*</span></label>
                                                    <input
                                                        className="form-control"
                                                        type="text"
                                                        name="CCTitle"
                                                        value={formData.CCTitle}
                                                        onChange={handleChange}
                                                    />
                                                </div>
                                            </div>

                                            {/* Quote */}
                                            <div className="col-12 col-md-6 col-xl-6">
                                                <div className="form-group local-forms">
                                                    <label>Quote <span className="login-danger">*</span></label>
                                                    <input
                                                        className="form-control"
                                                        type="text"
                                                        name="CCQuote"
                                                        value={formData.CCQuote}
                                                        onChange={handleChange}
                                                    />
                                                </div>
                                            </div>

                                            {/* Description */}
                                            <div className="col-12 col-sm-12">
                                                <div className="form-group local-forms">
                                                    <label>Description <span className="login-danger">*</span></label>
                                                    <textarea
                                                        className="form-control"
                                                        rows={3}
                                                        name="CCDescription"
                                                        value={formData.CCDescription}
                                                        onChange={handleChange}
                                                    />
                                                </div>
                                            </div>

                                            {/* Image Upload Component */}
                                            <ImageUpload id="image" src={formData.CCImage} loadFile={loadFile} imageName="Image" />

                                            {/* Submit/Cancel Button */}
                                            <div className="col-12">
                                                <div className="doctor-submit text-end">
                                                    <button
                                                        type="submit"
                                                        className="btn btn-primary submit-form me-2"
                                                        disabled={loading}
                                                    >
                                                        {loading ? "Updating..." : "Update"}
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="btn btn-primary cancel-form"
                                                        onClick={() => navigate("/landingpage/coursecontentbody")}
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                    <ToastContainer />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditCCBody;
