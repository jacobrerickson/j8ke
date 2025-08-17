import React from "react";

interface PasswordResetSuccessfulProps {
    email: string;
}

export const PasswordResetSuccessful: React.FC<PasswordResetSuccessfulProps> = (props) => {
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
                            <h3>Your Password has Been Reset</h3>
                            <p style={{ color: "#64758b" }}>The password for the account associated with the following email has been reset:</p>
                        </div>

                        <div style={{ width: "100%", textAlign: "center", borderRadius: "10px", backgroundColor: "#f8fafc", borderWidth: "1px", borderStyle: "solid", borderColor: "#f5f8fb" }}>
                            <p style={{ color: "#9ea9b7" }}><a rel="nofollow">{email}</a></p>
                        </div>

                        <div style={{ width: "100%" }}>
                            <p style={{ color: "#64758b" }}><strong>If you did not reset your password, please contact us using the link below.</strong></p>
                            <br></br>
                            <p style={{ width: "100%", textAlign: "center" }}><a href="https://www.tarifflo.com/pages/contact-us" style={{ color: "#6366f1", textDecoration: "none" }}><strong>Contact Us</strong></a></p>
                        </div>
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