import React from "react";
import Job_Home from "../Job_Home/Job_Home";
import Navbar from "../../conponents/navbar/navbar";
import TopCompany from "../TopCompany/TopCompany";
import TopJob from "../TopJob/TopJob";
import ListCompany from "../ListCompany/ListCompany";
import Footer from "../../conponents/Footer/Footer";

function Home(){
    return(
        <div>
            <Navbar/>
            <TopCompany/>
            <Job_Home/>
            <TopJob/>
            <ListCompany/>
            <Footer/>
        </div>
    );
}

export default Home;