import React, { useEffect } from "react";
import { useCookies } from "react-cookie";
import { useNavigate, useParams } from "react-router-dom";

export const OauthComponent = () => {
  const { token, expirationTime } = useParams();
  const [cookie, setCookie] = useCookies();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token || !expirationTime) return;

    const now = new Date().getTime();
    const expires = new Date(now + Number(expirationTime) * 1000);

    setCookie("accessToken", token, { expires, path: "/" });
    navigate("/");
  }, [token, expirationTime, setCookie, navigate]);

  return <div>Oauth</div>;
};
export default OauthComponent;
