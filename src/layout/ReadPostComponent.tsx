import React, { useContext, useEffect, useState } from "react";

import { useLocation, useNavigate, useParams } from "react-router-dom";
import Card from "../components/Card/Card";
import { AuthContext } from "../context/AuthContext";
import Modal from "react-modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faPen, faTrash, faFloppyDisk, faRotateLeft } from "@fortawesome/free-solid-svg-icons";
import "../components/Modal/Modal.css";
import { useFeeds } from "../context/FeedContext";

// 모달을 마운트할 요소 설정
Modal.setAppElement("#root");

interface ModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  feed: { id: number };
  updateDiary: (id: number) => void;
  deleteDiary: (id: number) => void;
}

const ReadPostComponent: React.FC<ModalProps> = () => {
  const { user } = useContext(AuthContext);
  const { id } = useParams();
  const { state } = useLocation();
  const {
    content,
    trackName,
    userId,
    create_date,
    isLiked,
    category,
    isRequesting,
    setIsRequesting,
    feedState,
    setFeedState,
  } = state || {};

  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const { toggleLike } = useFeeds();

  useEffect(() => {
    if (
      location.pathname.startsWith("/read/") ||
      location.pathname.startsWith("/edit/") ||
      location.pathname.startsWith("/mypage/read")
    ) {
      setIsOpen(true);
    }
  }, [location.pathname]);

  const onRequestClose = () => {
    setIsOpen(false);
    if (location.pathname.startsWith("/mypage/read")) {
      navigate("/mypage");
      return;
    }
    navigate("/");
  };

  const onUpdatePage = () => {
    if (location.pathname.startsWith("/mypage/")) return navigate(`/mypage/edit/${id}`);
    return navigate(`/edit/${id}`);
  };

  const onPagePop = () => {
    navigate(-1);
  };

  const renderModalTitle = () => {
    if (location.pathname.includes("/read/")) {
      return <div className="fs-3">Feed</div>;
    } else if (location.pathname.includes(`/edit/${id}`)) {
      if (id === "-1") {
        return <div className="fs-3">New Feed</div>;
      }
      return <div className="fs-3">Edit Feed</div>;
    }
  };

  const renderIcon = () => {
    if (location.pathname.includes("/read/")) {
      return (
        <div className="modal-header-icon">
          {userId === user.user_id ? (
            <FontAwesomeIcon className="modal-update-btn-icon fs-5 me-2" icon={faPen} onClick={onUpdatePage} />
          ) : null}
          {userId === user.user_id ? (
            <FontAwesomeIcon className="modal-delete-btn-icon fs-5 me-2" icon={faTrash} />
          ) : null}
          <FontAwesomeIcon className="modal-close-btn-icon fs-3" icon={faXmark} onClick={onRequestClose} />
        </div>
      );
    } else if (location.pathname.includes(`/edit/${id}`)) {
      return (
        <div className="modal-header-icon">
          <FontAwesomeIcon className="modal-save-btn-icon fs-5 me-2" icon={faFloppyDisk} />

          <FontAwesomeIcon className="modal-pop-btn-icon fs-5 me-2" icon={faRotateLeft} onClick={onPagePop} />

          <FontAwesomeIcon className="modal-close-btn-icon fs-3" icon={faXmark} onClick={onRequestClose} />
        </div>
      );
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Diary Modal"
      overlayClassName="modal-overlay"
      className="modal-content"
    >
      <div className="modal-header">
        {renderModalTitle()}
        {renderIcon()}
      </div>
      <div style={{ height: "400px", marginTop: "16px" }}>
        <Card
          mainfeed_id={id}
          isLiked={isLiked}
          content={content}
          trackName={trackName}
          user_id={user.user_id}
          cardClickHandler={null}
          toggleLike={toggleLike}
        />
      </div>
    </Modal>
  );
};

export default ReadPostComponent;
