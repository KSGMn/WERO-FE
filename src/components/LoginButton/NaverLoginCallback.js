import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const NaverLoginCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    const state = urlParams.get("state");

    if (code && state === "EXPECTED_STATE_STRING") {
      fetch("http://localhost:8080/login-naver", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code, state }),
      })
        .then((response) => response.json())
        .then((data) => {
          navigate("/sidebar"); // 성공적 로그인 후 리다이렉트할 경로
        })
        .catch((error) => {
          console.error("로그인 실패:", error);
        });
    }
  }, [navigate]);

  return <div>로그인 처리 중...</div>;
};

export default NaverLoginCallback;
