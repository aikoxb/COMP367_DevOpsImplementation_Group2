// study-planner-client/src/pages/Home.jsx
// Protected home page shown after successful login
// Receives user data from App.jsx, displays profile information & StudyTasks component

import StudyTasks from "../components/StudyTasks"; // Component that displays user's study tasks and allows them to add/edit/delete tasks

// For styling
import { Container, Card, Row, Col, Badge } from "react-bootstrap";
import "./Home.css"; 

// Home page component (protected) that displays user information and has study tasks management
export default function Home({ user }) {

    // Get user information from properties passed down from App.jsx
    const username = user.username;
    const firstName = user.firstName;
    const lastName = user.lastName;
    const program = user.program;
    const studyLevel = user.studyLevel;
    const preferredStudyTime = user.preferredStudyTime;

    // Combine first and last name into fullName for display
    const fullName = (firstName + " " + lastName).trim();

    // Render home page
    return (
        <Container fluid className="page-content">
            {/* Home page banner */}
            <Card className="shadow-sm banner-card">
                <Card.Body>
                    <Row className="align-items-center">
                        <Col md={8} >
                            <h1 className="mb-1 text-center" style={{marginLeft: "10rem"}}>Study Planner</h1>
                            <p className="mb-2 text-center" style={{marginLeft: "10rem"}}>
                                Welcome {fullName}!{" "}
                                <Badge bg="secondary">@{username}</Badge>
                            </p>
                        </Col>

                        {/* User profile information */}
                        <Col md={4} className="mt-3 mt-md-0">
                            <Card className="border-0 banner-info-card">
                                <Card.Body>
                                    <div className="banner-info-title">Your Profile</div>

                                    <div className="banner-info-grid">
                                        <div className="banner-info-item">
                                            <div className="banner-info-label">Program</div>
                                            <div className="banner-info-value">{program}</div>
                                        </div>

                                        <div className="banner-info-item">
                                            <div className="banner-info-label">Study Level</div>
                                            <div className="banner-info-value">{studyLevel}</div>
                                        </div>

                                        <div className="banner-info-item">
                                            <div className="banner-info-label">Preferred Study Time</div>
                                            <div className="banner-info-value">{preferredStudyTime}</div>
                                        </div>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            {/* Study Tasks Component*/}
            <div className="mt-4">
                <StudyTasks />
            </div>
        </Container>
    );
}