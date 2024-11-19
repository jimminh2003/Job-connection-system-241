import React from "react";
import Job_Home from "./Job_Home";
import Navbar from "./navbar";
import TopCompany from "./TopCompany";
import TopJob from "./TopJob";
import ListCompany from "./ListCompany";
import Footer from "./Footer";
import AppNavbar from "./AppNavbar";
import '../css/Home.css'

function Home(){
    return(
        <div id="home-container">
            <AppNavbar/>
            <TopCompany/>
            <Job_Home/>
            <TopJob/>
            <ListCompany/>
            <Footer/>
        </div>
    );
}

export default Home;