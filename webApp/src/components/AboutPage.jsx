import React from "react";
import { Link } from "react-router";
import "../styles/about-page.css";
import { View, Text, Image, StyleSheet } from "react-primitives";

import Calendar from "../../sharedComponents/Calendar.jsx";
// Since this component is simple and static, there's no parent container for it.
const AboutPage = () => {
  return <Calendar />;
};

export default AboutPage;
