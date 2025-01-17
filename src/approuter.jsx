import React from "react";
// eslint-disable-next-line no-unused-vars

import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./components/pages/login";
// import config from "config";
import Addblog from "./components/pages/Blog/Addblog";
import Blogdetails from "./components/pages/Blog/Blogdetails";
import BlogView from "./components/pages/Blog/BlogView";
import Editblog from "./components/pages/Blog/Editblog";
//For Settings...

//Meeting
import AddMeeting from "./components/meeting/AddMeeting";
import EditMeeting from "./components/meeting/EditMeeting";
import MeetingList from "./components/meeting/MeetingList";
//Participents...
import ParticipentList from "./components/participent/ParticipentList";

import HeroSection from "./components/Landing Page/Hero Section/HeroSection";
import EditHeroSection from "./components/Landing Page/Hero Section/EditHeroSection";

import EditParticipent from "./components/participent/EditParticipent";

import AddAdmin from "./components/Admin/Add-Admin";

import ForgotPassword from "./components/pages/login/ForgotPassword";

import Admin_Dashboard from "./components/Dashboard/Admin_Dashboard/Admin_Dashboard";
import ChangePassword from "./components/pages/login/ChangePassword";

import ServerError from "./components/pages/login/ServerError";

import Layout from "./components/Layout";
import Home from "./components/pages/Home";
import Blog_client_side from "./components/pages/Blog";
import BlogDetail from "./components/pages/BlogDetails";

// Landing Page
import CEHeader from "./components/Landing Page/ChildEmergency/CEHeader";
import EditCEHeader from "./components/Landing Page/ChildEmergency/EditCEHeader";
import CEBody from "./components/Landing Page/ChildEmergency/CEBody";
import AddCEBody from "./components/Landing Page/ChildEmergency/AddCEBody";
import EditCEBody from "./components/Landing Page/ChildEmergency/EditCEBody";
import CCHeading from "./components/Landing Page/courseContent/CCHeading";
import CCBody from "./components/Landing Page/courseContent/CCBody";
import EditCCBody from "./components/Landing Page/courseContent/EditCCBody";
import EditCCHeading from "./components/Landing Page/courseContent/EditCCHeading";
import AddCCBody from "./components/Landing Page/courseContent/AddCCBody";
import OMHeading from "./components/Landing Page/organizationMatters/OMHeading";
import EditOMHeading from "./components/Landing Page/organizationMatters/EditOMHeading";
import OMBody from "./components/Landing Page/organizationMatters/OMBody";
import EditOMBody from "./components/Landing Page/organizationMatters/EditOMBody";
import AddOMBody from "./components/Landing Page/organizationMatters/AddOMBody";
import Contact from "./components/pages/Contact";
import AddGallery from "./components/Gallery/AddGallery";
import ErrorPage from "./components/pages/ErrorPage";
import Contactlist from "./components/contactlist";
import GalleryList from "./components/Gallery/GalleryList";
import EditGallery from "./components/Gallery/EditGallery";
import Policy from "./components/Policy";
import Settings from "./components/Settings";

//Accounts
const Approuter = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/forgotpassword" element={<ForgotPassword />} />

          <Route path="/settings" element={<Settings />} />

          <Route path="/changepassword" element={<ChangePassword />} />
          <Route path="/server-error" element={<ServerError />} />

          <Route path="/gallerylist" element={<GalleryList />} />
          <Route path="/gallerylist/add" element={<AddGallery />} />
          <Route path="/gallerylist/edit" element={<EditGallery />} />

          {/* Contact */}

          <Route path="/contactlist" element={<Contactlist />} />
          {/* Blog */}
          <Route path="/blogadmin" element={<Blogdetails />} />
          <Route path="/addblog" element={<Addblog />} />
          <Route path="/editblog/:id" element={<Editblog />} />
          <Route path="/blogview" element={<BlogView />} />

          {/* meeting  */}
          <Route path="/meetinglist" element={<MeetingList />} />
          <Route path="/add-meeting" element={<AddMeeting />} />
          <Route path="/editmeeting" element={<EditMeeting />} />

          {/* Participent */}
          <Route
            path="/meetinglist/participantlist"
            element={<ParticipentList />}
          />
          <Route
            path="/meetinglist/participantlist/edit"
            element={<EditParticipent />}
          />
          {/* Hero Section */}
          <Route path="/landingpage/herosection" element={<HeroSection />} />
          <Route
            path="/landingpage/editherosection/:id"
            element={<EditHeroSection />}
          />
          {/* <Route path="/editappoinments" element={<EditAppoinments />} /> */}

          {/* Child Emergency */}
          <Route
            path="/landingpage/childemergencyheader"
            element={<CEHeader />}
          />
          <Route
            path="/landingpage/editchildemergencyheader/:id"
            element={<EditCEHeader />}
          />

          <Route path="/landingpage/childemergencybody" element={<CEBody />} />
          <Route
            path="/landingpage/childemergencybody/addchildemergencybody"
            element={<AddCEBody />}
          />
          <Route
            path="/landingpage/childemergencybody/editchildemergencybody/:id"
            element={<EditCEBody />}
          />

          {/* CCourse Content */}
          <Route
            path="/landingpage/coursecontentheading"
            element={<CCHeading />}
          />
          <Route
            path="/landingpage/coursecontentheading/editcoursecontentheading/:id"
            element={<EditCCHeading />}
          />

          <Route path="/landingpage/coursecontentbody" element={<CCBody />} />
          <Route
            path="/landingpage/coursecontentbody/editcoursecontentbody/:id"
            element={<EditCCBody />}
          />
          <Route
            path="/landingpage/coursecontentbody/addcoursecontentbody"
            element={<AddCCBody />}
          />

          {/* Orgazinzation Matters */}
          <Route
            path="/landingpage/organizationmattersheading"
            element={<OMHeading />}
          />
          <Route
            path="/landingpage/organizationmattersheading/editorganizationmattersheading/:id"
            element={<EditOMHeading />}
          />

          <Route
            path="/landingpage/organizationmattersbody"
            element={<OMBody />}
          />
          <Route
            path="/landingpage/organizationmattersbody/editorganizationmattersbody/:id"
            element={<EditOMBody />}
          />
          <Route
            path="/landingpage/organizationmattersbody/addorganizationmattersbody"
            element={<AddOMBody />}
          />

          {/* Admin */}

          <Route path="/addadmin" element={<AddAdmin />} />

          {/* Dashboard */}
          <Route path="/admin-dashboard" element={<Admin_Dashboard />} />

          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />

            <Route path="blog" element={<Blog_client_side />} />
            <Route path="/blog/blog-details/:id" element={<BlogDetail />} />
            <Route path="/policy" element={<Policy />} />
            <Route path="contact" element={<Contact />} />
          </Route>
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </BrowserRouter>
      <div className="sidebar-overlay"></div>
    </>
  );
};

export default Approuter;
