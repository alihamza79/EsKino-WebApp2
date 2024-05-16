import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  addDocument,
  getDocument,
  updateDocument,
} from "../../services/dbService";
import { arrowWhiteSvg } from "../imagepath";
import { Link } from "react-router-dom";

export default function AppointmentForm({ sectionId }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: { persons: "1" },
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [meetingData, setMeetingData] = useState(null);
  const [totalFee, setTotalFee] = useState(0);
  const [originalPrice, setOriginalPrice] = useState(0);

  useEffect(() => {
    const fetchMeetingData = async () => {
      try {
        const doc = await getDocument("meetings", sectionId);
        if (doc.exists()) {
          const data = doc.data();
          setMeetingData(data);
          calculateTotalFee(1, data); // Calculate the total fee for 1 person by default
        } else {
          toast.error("Meeting not found.");
        }
      } catch (error) {
        console.error("Error fetching meeting data: ", error);
        toast.error("Failed to fetch meeting data.");
      }
    };
    fetchMeetingData();
  }, [sectionId]);

  const calculateTotalFee = (persons, meetingData) => {
    if (meetingData) {
      let discount = 0;
      if (persons === 2) {
        discount = meetingData.discountFor2Persons;
      } else if (persons === 3) {
        discount = meetingData.discountFor3Persons;
      }
      const originalFee = meetingData.priceInEuro * persons;
      const discountedFee = originalFee * (1 - discount / 100);
      setOriginalPrice(originalFee);
      setTotalFee(discountedFee);
    }
  };

  const onSubmit = async (data) => {
    data.sectionId = sectionId;
    data.totalFee = totalFee;
    setIsSubmitting(true);

    try {
      const doc = await getDocument("meetings", data.sectionId);
      if (doc.exists()) {
        const meetingData = doc.data();
        if (meetingData.capacity >= parseInt(data.persons, 10)) {
          const updatedCapacity =
            meetingData.capacity - parseInt(data.persons, 10);
          const updatedParticipants =
            meetingData.Participants + parseInt(data.persons, 10);

          await updateDocument("meetings", data.sectionId, {
            capacity: updatedCapacity,
            Participants: updatedParticipants,
          });
          await addDocument("participants", data);
          toast.success("Session has been booked. Thank you!");
        } else {
          toast.error(
            "Not enough capacity for the requested number of persons."
          );
        }
      } else {
        toast.error("Meeting not found.");
      }
    } catch (error) {
      console.error("Error handling meeting data: ", error);
      toast.error("Failed to handle meeting data.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const persons = watch("persons");

  useEffect(() => {
    if (meetingData) {
      calculateTotalFee(parseInt(persons, 10), meetingData);
    }
  }, [persons, meetingData]);

  return (
    <div>
      <ToastContainer />
      <form onSubmit={handleSubmit(onSubmit)} className="row">
        <div className="col-lg-6">
          <label className="cs_input_label cs_heading_color">First Name</label>
          <input
            {...register("firstName", { required: true })}
            type="text"
            className="cs_form_field"
            placeholder="David John"
          />
          {errors.firstName && (
            <div className="error text-danger">This field is required</div>
          )}
        </div>
        <div className="col-lg-6">
          <label className="cs_input_label cs_heading_color">Last Name</label>
          <input
            {...register("lastName", { required: true })}
            type="text"
            className="cs_form_field"
            placeholder="Smith"
          />
          {errors.lastName && (
            <div className="error text-danger">This field is required</div>
          )}
        </div>
        <div className="col-lg-12">
          <label className="cs_input_label cs_heading_color">Email</label>
          <input
            {...register("email", { required: true })}
            type="email"
            className="cs_form_field"
            placeholder="example@gmail.com"
          />
          {errors.email && (
            <div className="error text-danger">This field is required</div>
          )}
        </div>
        <div className="col-lg-12">
          <label className="cs_input_label cs_heading_color">Address</label>
          <input
            {...register("address", { required: true })}
            type="text"
            className="cs_form_field"
            placeholder="Address"
          />
          {errors.address && (
            <div className="error text-danger">This field is required</div>
          )}
        </div>
        <div className="col-lg-4">
          <label className="cs_input_label cs_heading_color">Select Persons:</label>
          <select
            {...register("persons", { required: true })}
            className="cs_form_field"
          >
            <option value="1">1 person</option>
            <option value="2">2 persons</option>
            <option value="3">3 persons</option>
          </select>
          {errors.persons && (
            <div className="error text-danger">This field is required</div>
          )}
        </div>
        <div className="col-lg-8 d-flex align-items-end">
          <label className="cs_input_label cs_heading_color me-2">Total Fee:</label>
          {originalPrice > totalFee && (
            <span style={{ textDecoration: "line-through", color: "red", marginBottom: "0.65rem" }}>
              €{originalPrice.toFixed(2)}
            </span>
          )}
          <span
            style={{
              backgroundColor: "#2FCE2E",
              color: "white",
              padding: "5px 10px",
              borderRadius: "5px",
              marginLeft: "10px",
              marginBottom: "0.4rem",
            }}
          >
            €{totalFee.toFixed(2)}
          </span>
        </div>
        <div className="col-lg-12">
          <label className="cs_input_label cs_heading_color">Name of Persons</label>
          <input
            {...register("personNames", { required: true })}
            type="text"
            className="cs_form_field"
            placeholder="name1, name2 etc"
          />
          {errors.personNames && (
            <div className="error text-danger">This field is required</div>
          )}
        </div>
        <div className="col-lg-12">
          <label className="cs_input_label cs_heading_color">Select Option</label>
          <div className="cs_radio_group">
            <div className="cs_radio_wrap">
              <input
                {...register("gender", { required: true })}
                className="cs_radio_input"
                type="radio"
                value="Male"
                id="Male"
              />
              <label className="cs_radio_label" htmlFor="Male">Male</label>
            </div>
            <div className="cs_radio_wrap">
              <input
                {...register("gender", { required: true })}
                className="cs_radio_input"
                type="radio"
                value="Female"
                id="Female"
              />
              <label className="cs_radio_label" htmlFor="Female">Female</label>
            </div>
          </div>
          {errors.gender && (
            <div className="error text-danger">This field is required</div>
          )}
        </div>
        <div className="col-lg-12">
          <label className="cs_input_label cs_heading_color" style={{ marginTop: "15px" ,backgroundColor:"#CFECF7", padding:"0.7rem",borderRadius:"10px"}}>
            <input
              type="checkbox"
              {...register("policyAccepted", { required: true })}
            />
            {" "}
            I hereby confirm that I have read the information below and have taken note of the information on{" "}
            <Link
              to="/policy"
              style={{ color: "blue" }}
              target="_blank"
              rel="noopener noreferrer"
            >
              data protection
            </Link>.
          </label>
          {errors.policyAccepted && (
            <div className="error text-danger">This field is required</div>
          )}
        </div>
        <div className="col-lg-12 flex justify-end">
          <button
            className="cs_btn cs_style_1"
            type="submit"
            disabled={isSubmitting}
          >
            <span>{isSubmitting ? "Submitting..." : "Submit"}</span>
            <i>
              <img src={arrowWhiteSvg} alt="Icon" />
            </i>
          </button>
        </div>
      </form>
    </div>
  );
}
