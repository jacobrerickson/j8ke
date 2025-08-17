import React from "react";

interface VerificationEmailProps {
    vLink: string;
    email: string;
}

export const NewEmailVerification: React.FC<VerificationEmailProps> = (props) => {
    const link = props.vLink;
    const email = props.email;

    return (
        <div
            style={{
                backgroundColor: "#eff3f8",
                width: "100%",
                maxWidth: "40rem",
                height: "100%",
                margin: "auto",
                borderRadius: "10px",
                opacity: "1",
                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)"
            }}
        >
            <div
                style={{
                    height: "100%",
                    width: "90%",
                    margin: "auto",
                    paddingTop: "3rem",
                    paddingBottom: "1rem",
                }}
            >
                <img
                    src="https://www.tarifflo.com/_next/image?url=%2Flogo.png&w=256&q=75"
                    alt="Company Logo"
                    style={{
                        width: "7rem",
                        marginBottom: "1rem",
                    }}
                />
                <div
                    style={{
                        backgroundColor: "#ffffff",
                        height: "100%",
                        borderRadius: "10px",
                        paddingLeft: "20px",
                        paddingRight: "20px",
                        paddingTop: "10px",
                        paddingBottom: "10px",
                        alignItems: "center",
                        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)"
                    }}
                >
                    <div
                        style={{
                            width: "auto",
                            borderRadius: "10px",
                        }}
                    >
                        <div style={{ width: "100%" }}>
                            <h3>Verify New Email</h3>
                            <p style={{ color: "#64758b" }}>Confirm that this is the updated email for your Tarifflo account by clicking the button below.</p>
                        </div>

                        <div style={{ width: "60%", margin: "auto" }}>
                            <a href={link} style={{ color: "white" }}>
                                <button
                                    style={{
                                        backgroundColor: "#6366f1",
                                        borderRadius: "10px",
                                        width: "100%",
                                        height: "40px",
                                        textAlign: "center",
                                        color: "white",
                                        outline: "none",
                                        border: "none"
                                    }}
                                >
                                    Verify
                                </button>
                            </a>
                        </div>
                        <br></br>
                    </div>
                </div>
                <div
                    style={{
                        height: "fit-content",
                        justifyContent: "center",
                        alignItems: "center",
                        textAlign: "center",
                        color: "#64758b",
                        fontSize: "0.7rem",
                    }}
                >
                    <p>Need help? <a href="https://www.tarifflo.com/pages/contact-us" style={{ color: "#6366f1", textDecoration: "none" }}>Contact Us | Tarifflo.com</a></p>
                    <br></br>
                    <p>This email was sent to <a rel="nofollow">{email}</a></p>
                    <p>Tarifflo | 223 Cougar Blvd #401, Provo, UT 84604 | USA</p>
                </div>
            </div>
        </div>
    );
};