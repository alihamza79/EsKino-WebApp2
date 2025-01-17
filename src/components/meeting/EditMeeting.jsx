import React, { useState, useEffect } from "react";
import Header from "../Header";
import Sidebar from "../Sidebar";
import { DatePicker, TimePicker } from "antd";
import moment from "moment";
import { Link, useLocation, useNavigate } from "react-router-dom";
import FeatherIcon from "feather-icons-react/build/FeatherIcon";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../config/firebase";

const EditMeeting = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get("id");
  const initialMeetingData = {
    title: "",
    startDate: null,
    endDate: null,
    startTime: null,
    endTime: null,
    houseOwner: "",
    zipCode: "",
    streetAddress: "",
    capacity: "",
    priceInEuro: "",
    discountFor2Persons: "",
    discountFor3Persons: "",
  };

  const [meetingData, setMeetingData] = useState(initialMeetingData);

  useEffect(() => {
    if (id) {
      const docRef = doc(db, "meetings", id);
      getDoc(docRef)
        .then((docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            setMeetingData({
              title: data.title || "",
              startDate: data.startDate
                ? moment(data.startDate.toDate())
                : null,
              endDate: data.endDate ? moment(data.endDate.toDate()) : null,
              startTime: data.startTime
                ? moment(data.startTime.toDate())
                : null,
              endTime: data.endTime ? moment(data.endTime.toDate()) : null,
              houseOwner: data.houseOwner || "",
              streetAddress: data.streetAddress || "",
              zipCode: data.zipCode || "",
              capacity: data.capacity || "",
              priceInEuro: data.priceInEuro || "",
              discountFor2Persons: data.discountFor2Persons || "",
              discountFor3Persons: data.discountFor3Persons || "",
            });
          }
        })
        .catch((error) => {
          console.error("Error fetching document:", error);
        });
    }
  }, [id]);

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setMeetingData({ ...meetingData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: null });
    }
  };

  const handleDateTimeChange = (value, name) => {
    setMeetingData({ ...meetingData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const validateForm = () => {
    let isValid = true;
    let newErrors = {};

    const requiredFields = [
      "title",
      "startDate",
      "endDate",
      "startTime",
      "endTime",
      "houseOwner",
      "streetAddress",
      "zipCode",
      "capacity",
      "priceInEuro",
      "discountFor2Persons",
      "discountFor3Persons",
    ];
    requiredFields.forEach((field) => {
      if (
        !meetingData[field] ||
        (meetingData[field] instanceof moment && !meetingData[field].isValid())
      ) {
        isValid = false;
        newErrors[field] = "This field is required";
      }
    });

    if (
      meetingData.startTime &&
      meetingData.endTime &&
      !meetingData.endTime.isAfter(meetingData.startTime)
    ) {
      isValid = false;
      newErrors.endTime = "End time must be after start time";
    }

    if (
      meetingData.startDate &&
      meetingData.endDate &&
      meetingData.endDate.isBefore(meetingData.startDate)
    ) {
      isValid = false;
      newErrors.endDate = "End date must be the same or after start date";
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);

      const docRef = doc(db, "meetings", id);

      const dataToSave = {
        title: meetingData.title,
        startDate: meetingData.startDate
          ? meetingData.startDate.toDate()
          : null,
        endDate: meetingData.endDate ? meetingData.endDate.toDate() : null,
        startTime: meetingData.startTime
          ? meetingData.startTime.toDate()
          : null,
        endTime: meetingData.endTime ? meetingData.endTime.toDate() : null,
        houseOwner: meetingData.houseOwner,
        streetAddress: meetingData.streetAddress,
        zipCode: meetingData.zipCode,
        capacity: meetingData.capacity,
        priceInEuro: meetingData.priceInEuro,
        discountFor2Persons: meetingData.discountFor2Persons,
        discountFor3Persons: meetingData.discountFor3Persons,
      };

      try {
        await updateDoc(docRef, dataToSave);
        console.log("Document successfully updated!");
        setIsSubmitting(false);
        navigate("/meetinglist");
      } catch (error) {
        console.error("Error updating document: ", error);
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div>
      <Header />
      <Sidebar id="menu-item2" activeClassName="add-meeting" />
      <div className="page-wrapper">
        <div className="content">
          <div className="page-header">
            <div className="row">
              <div className="col-sm-12">
                <ul className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="/meetinglist">Meetings</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <i className="feather-chevron-right">
                      <FeatherIcon icon="chevron-right" />
                    </i>
                  </li>
                  <li className="breadcrumb-item active">Edit Meeting</li>
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
                        <div className="form-group">
                          <label>
                            Title <span className="login-danger">*</span>
                          </label>
                          <input
                            className="form-control"
                            type="text"
                            name="title"
                            placeholder="Enter meeting title"
                            value={meetingData.title}
                            onChange={handleChange}
                          />
                          {errors.title && (
                            <div className="error text-danger">
                              {errors.title}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="col-12 col-md-4">
                        <div className="form-group">
                          <label>
                            Start Date <span className="login-danger">*</span>
                          </label>
                          <DatePicker
                            className="form-control"
                            onChange={(date) =>
                              handleDateTimeChange(date, "startDate")
                            }
                            value={meetingData.startDate}
                          />
                          {errors.startDate && (
                            <div className="error text-danger">
                              {errors.startDate}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="col-12 col-md-4">
                        <div className="form-group">
                          <label>
                            End Date <span className="login-danger">*</span>
                          </label>
                          <DatePicker
                            className="form-control"
                            onChange={(date) =>
                              handleDateTimeChange(date, "endDate")
                            }
                            value={meetingData.endDate}
                          />
                          {errors.endDate && (
                            <div className="error text-danger">
                              {errors.endDate}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="col-12 col-md-4">
                        <div className="form-group">
                          <label>
                            Start Time{" "}
                            <span className="login-danger text-danger">*</span>
                          </label>
                          <TimePicker
                            className="form-control"
                            use12Hours
                            format="h:mm a"
                            onChange={(time) =>
                              handleDateTimeChange(time, "startTime")
                            }
                            value={meetingData.startTime}
                          />
                          {errors.startTime && (
                            <div className="error text-danger">
                              {errors.startTime}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="col-12 col-md-4">
                        <div className="form-group">
                          <label>
                            End Time <span className="login-danger">*</span>
                          </label>
                          <TimePicker
                            className="form-control"
                            use12Hours
                            format="h:mm a"
                            onChange={(time) =>
                              handleDateTimeChange(time, "endTime")
                            }
                            value={meetingData.endTime}
                          />
                          {errors.endTime && (
                            <div className="error text-danger">
                              {errors.endTime}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="form-group">
                          <label>
                            House Owner <span className="login-danger">*</span>
                          </label>
                          <input
                            className="form-control"
                            type="text"
                            name="houseOwner"
                            placeholder="Enter house owner's name"
                            value={meetingData.houseOwner}
                            onChange={handleChange}
                          />
                          {errors.houseOwner && (
                            <div className="error text-danger">
                              {errors.houseOwner}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="form-group">
                          <label>
                            Street Address{" "}
                            <span className="login-danger">*</span>
                          </label>
                          <input
                            className="form-control"
                            type="text"
                            name="streetAddress"
                            placeholder="Enter street address"
                            value={meetingData.streetAddress}
                            onChange={handleChange}
                          />
                          {errors.streetAddress && (
                            <div className="error text-danger">
                              {errors.streetAddress}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="col-12 col-md-6">
                        <div className="form-group">
                          <label>
                            ZIP Code <span className="login-danger">*</span>
                          </label>
                          <input
                            className="form-control"
                            type="text"
                            name="zipCode"
                            placeholder="Enter ZIP code"
                            value={meetingData.zipCode}
                            onChange={handleChange}
                          />
                          {errors.zipCode && (
                            <div className="error text-danger">
                              {errors.zipCode}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="col-12 col-md-6">
                        <div className="form-group">
                          <label>
                            Capacity <span className="login-danger">*</span>
                          </label>
                          <input
                            className="form-control"
                            type="number"
                            name="capacity"
                            placeholder="Enter capacity"
                            value={meetingData.capacity}
                            onChange={handleChange}
                          />
                          {errors.capacity && (
                            <div className="error text-danger">
                              {errors.capacity}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="col-12 col-md-4">
                        <div className="form-group">
                          <label>
                            Price in Euro <span className="login-danger">*</span>
                          </label>
                          <input
                            className="form-control"
                            type="number"
                            name="priceInEuro"
                            placeholder="Enter price in Euro"
                            value={meetingData.priceInEuro}
                            onChange={handleChange}
                          />
                          {errors.priceInEuro && (
                            <div className="error text-danger">
                              {errors.priceInEuro}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="col-12 col-md-4">
                        <div className="form-group">
                          <label>
                            Discount for 2 Persons (%){" "}
                            <span className="login-danger">*</span>
                          </label>
                          <input
                            className="form-control"
                            type="number"
                            name="discountFor2Persons"
                            placeholder="Enter discount for 2 persons"
                            value={meetingData.discountFor2Persons}
                            onChange={handleChange}
                          />
                          {errors.discountFor2Persons && (
                            <div className="error text-danger">
                              {errors.discountFor2Persons}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="col-12 col-md-4">
                        <div className="form-group">
                          <label>
                            Discount for 3 Persons (%){" "}
                            <span className="login-danger">*</span>
                          </label>
                          <input
                            className="form-control"
                            type="number"
                            name="discountFor3Persons"
                            placeholder="Enter discount for 3 persons"
                            value={meetingData.discountFor3Persons}
                            onChange={handleChange}
                          />
                          {errors.discountFor3Persons && (
                            <div className="error text-danger">
                              {errors.discountFor3Persons}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="doctor-submit text-end">
                          <button
                            type="submit"
                            className="btn btn-primary submit-form me-2"
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? "Submitting..." : "Submit"}
                          </button>
                          <button
                            type="button"
                            className="btn btn-primary cancel-form"
                            onClick={() => navigate("/meetinglist")}
                          >
                            Cancel
                          </button>
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

export default EditMeeting;
