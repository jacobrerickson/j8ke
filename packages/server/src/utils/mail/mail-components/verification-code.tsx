import React from "react";

interface VerificationCodeProps {
    code: string;
    email: string;
}

export const VerificationCode: React.FC<VerificationCodeProps> = (props) => {
    const code = props.code;
    const email = props.email;

    return(
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
                        <div style={{ 
                                width: "100%", 
                                position: "absolute", 
                                top: "50%", 
                                left: "50%", 
                                transform: "translate(-50%, -50%)", 
                                textAlign: "center" 
                            }}>
                            <p style={{ color: "#64758b" }}>Use the following code to log in:</p>
                            <h2 style={{
                                    width: "50%", 
                                    backgroundColor: "#eff3f7", 
                                    margin: "auto", 
                                    borderRadius: "10px", 
                                    paddingTop: "5px", 
                                    paddingBottom: "5px"
                                }}
                            >
                                {code}
                            </h2>
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
}