import React from "react";
import { Link } from "react-router";
import "../styles/about-page.css";
import { View, Text, Image, StyleSheet } from "react-primitives";

import Journey from "../../sharedComponents/Journey/Journey";
// Since this component is simple and static, there's no parent container for it.
const AboutPage = () => {
  return <Journey />;
};

export default AboutPage;
