import React, { useContext, useEffect, useState } from "react";

import { useLocation, useNavigate, useParams } from "react-router-dom";
import Card from "../components/Card/Card";
import { AuthContext } from "../context/AuthContext";
import Modal from "react-modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faPen, faTrash, faFloppyDisk, faRotateLeft } from "@fortawesome/free-solid-svg-icons";
import "../components/Modal/Modal.css";
import { ApiOneDiaryResponse, ApiOneResponse, useFeeds } from "../context/FeedContext";
import {
  createDiary,
  createFeed,
  deleteFeed,
  feedReport,
  findOneDiary,
  findOneFeed,
  updateDiary,
  updateFeed,
} from "../api";
import UpdateFeedRequestDto from "../api/request/feed/update-feed.request.dto";
import CreateFeedRequestDto from "../api/request/feed/create-feed.request.dto";
import ModalCard from "../components/Card/ModalCard";
import { backgroundOptions, colorMap, imageMap } from "../components/Modal/BackgroundSelector";
import CreateDiaryRequestDto from "../api/request/diary/create-diary.request.dto";
import UpdateDiaryRequestDto from "../api/request/diary/update-diary.request.dto";
import { deleteDiary } from "../api/index";

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
  const { content, trackName, userId, image, isLiked, category, isBookmarked } = state || {};

  const [originalContent, setOriginalContent] = useState(content);
  const [originalTrackName, setOriginalTrackName] = useState(trackName);
  const [originalBackground, setOriginalBackground] = useState(image ? image : "white");
  const [originalEmotion, setOriginalEmotion] = useState(category);
  const [isContent, setIsContent] = useState(content);
  const [Liked, setLiked] = useState(isLiked);
  const [Bookmarked, setBookmarked] = useState(isBookmarked);
  const [isTrackName, setIsTrackName] = useState(trackName);
  const [selectedEmotion, setSelectedEmotion] = useState(category ? category : "");
  const [selectedBackground, setSelectedBackground] = useState(image ? image : "white");

  const [isOpen, setIsOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isAlreadyReportConfirmModalOpen, setIsAlreadyReportConfirmModalOpen] = useState(false);
  const [isDeleteConfirmModalOpen, setIsDeleteConfirmModalOpen] = useState(false);
  const [isReportConfirmModalOpen, setIsReportConfirmModalOpen] = useState(false);
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const [isEmotionOpen, setIsEmotionOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const location = useLocation();
  const navigate = useNavigate();

  const { toggleLike } = useFeeds();

  if (id === undefined) {
    throw new Error("ID is undefined");
  }

  useEffect(() => {
    if (location.pathname.includes("/read/") || location.pathname.includes("/edit/")) {
      setIsOpen(true);
    }
    if (id === "-1") {
      setIsLoading(false);
      return;
    }
    if (location.pathname.startsWith("/read/")) {
      const findOneFeedResponse = (getFeed: ApiOneResponse) => {
        if (getFeed) {
          setIsContent(getFeed.data.content);
          setSelectedBackground(getFeed.data.image);
          setSelectedEmotion(getFeed.data.category);
          setLiked(getFeed.data.liked);
        }
      };
      findOneFeed(user.user_id, parseInt(id)).then(findOneFeedResponse);
    }
    if (location.pathname.includes("/diary/read")) {
      const findOneDiaryResponse = (getDiary: ApiOneDiaryResponse) => {
        if (getDiary) {
          setIsContent(getDiary.diaryContent);
          setSelectedBackground(getDiary.image);
          setSelectedEmotion(getDiary.emotion);
          setIsTrackName(getDiary.song);
          setLiked(getDiary.isBookmarked);
        }
      };
      findOneDiary(parseInt(id)).then(findOneDiaryResponse);
    }
    setIsLoading(false);
  }, [location.pathname, Liked]);

  const loadingDiv = () => {
    if (isLoading) {
      return <div className="center-message"></div>;
    }
  };

  const startsWithsMypage = () => {
    if (location.pathname.startsWith("/mypage")) {
      navigate("/mypage");
      return true;
    }
    return false;
  };
  const startsWithsDiary = () => {
    if (location.pathname.startsWith("/diary")) {
      navigate("/diary");
      return true;
    }
    return false;
  };
  const startsWithsHistory = () => {
    if (location.pathname.startsWith("/history")) {
      navigate("/history");
      return true;
    }
    return false;
  };
  const startsWithsLikes = () => {
    if (location.pathname.startsWith("/likes")) {
      navigate("/likes");
      return true;
    }
    return false;
  };

  const onRequestClose = () => {
    setIsOpen(false);
    if (startsWithsMypage()) return;
    if (startsWithsHistory()) return;
    if (startsWithsDiary()) return;
    if (startsWithsLikes()) return;

    navigate("/");
  };

  if (id === undefined) {
    return <p>ID is undefined</p>;
  }

  const onUpdatePage = () => {
    if (location.pathname.startsWith("/mypage/")) return navigate(`/mypage/edit/${id}`);
    if (location.pathname.startsWith("/diary/")) return navigate(`/diary/edit/${id}`);
    return navigate(`/edit/${id}`);
  };

  const onPagePop = () => {
    setIsContent(isContent);
    setSelectedEmotion(selectedEmotion);
    setSelectedBackground(selectedBackground);
    navigate(-1);
  };

  const renderModalTitle = () => {
    const titleName = location.pathname.includes("diary") ? "Diary" : "Feed";

    if (location.pathname.includes("/read/")) {
      return <div className="fs-3">{titleName}</div>;
    } else if (location.pathname.includes(`/edit/${id}`)) {
      if (id === "-1") {
        return <div className="fs-3">{`New ${titleName}`}</div>;
      }
      return <div className="fs-3">{`Edit ${titleName}`}</div>;
    }
  };

  const saveBtn = () => {
    const pathName = location.pathname.includes("diary") ? "diary" : "feed";

    if (location.pathname.includes("/edit/-1") && pathName === "feed") {
      if (isContent === "" || selectedBackground === "" || selectedEmotion === "") {
        alert("제목, 배경, 감정은 필수 내용입니다.");
        return;
      } else {
        const createFeedsResponse = (newFeed: any) => {
          if (newFeed) {
            setIsContent(isContent);
            setSelectedEmotion(selectedEmotion);
            setSelectedBackground(selectedBackground);
          }
        };
        const requestBody: CreateFeedRequestDto = {
          content: isContent,
          category: selectedEmotion,
          image: selectedBackground,
        };
        createFeed(requestBody, user.user_id).then(createFeedsResponse);
        setIsConfirmModalOpen(true);
      }
      return;
    }

    if (location.pathname.includes("/edit/-1") && pathName === "diary") {
      if (isContent === "" || isTrackName === "" || selectedEmotion === "" || selectedBackground === "") {
        alert("제목, 내용, 감정, 배경은 필수 내용입니다.");
        return;
      } else {
        const createDiaryResponse = (newFeed: any) => {
          if (newFeed) {
            setIsContent(isContent);
            setSelectedEmotion(selectedEmotion);
            setIsTrackName(isTrackName);
          }
        };
        const requestBody: CreateDiaryRequestDto = {
          diaryContent: isContent,
          emotion: selectedEmotion,
          song: isTrackName,
          image: selectedBackground,
        };
        createDiary(requestBody).then(createDiaryResponse);
        setIsConfirmModalOpen(true);
      }
      return;
    }

    if (location.pathname.includes(`/edit/${id}`) && pathName === "feed") {
      if (
        isContent === originalContent &&
        selectedBackground === originalBackground &&
        selectedEmotion === originalEmotion
      ) {
        alert("변경 사항이 없습니다");
        return;
      } else {
        const updateFeedResponse = (newFeed: any) => {
          if (newFeed) {
            setIsContent(isContent);
            setSelectedEmotion(selectedEmotion);
            setIsTrackName(isTrackName);
          }
        };
        const requestBody: UpdateFeedRequestDto = {
          content: isContent,
          category: selectedEmotion,
          image: selectedBackground,
        };
        updateFeed(requestBody, user.user_id, parseInt(id)).then(updateFeedResponse);
        navigate(-1);
        return;
      }
    }

    if (location.pathname.includes(`/edit/${id}`) && pathName === "diary") {
      if (
        isContent === originalContent &&
        selectedBackground === originalBackground &&
        selectedEmotion === originalEmotion &&
        isTrackName === originalTrackName
      ) {
        alert("변경 사항이 없습니다");
        return;
      } else {
        const updateDiaryResponse = (newFeed: any) => {
          if (newFeed) {
            setIsContent(isContent);
            setSelectedEmotion(selectedEmotion);
            setSelectedBackground(selectedBackground);
          }
        };
        const requestBody: UpdateDiaryRequestDto = {
          diaryContent: isContent,
          emotion: selectedEmotion,
          song: isTrackName,
          image: selectedBackground,
        };
        updateDiary(requestBody, parseInt(id)).then(updateDiaryResponse);
        navigate(-1);
        return;
      }
    }
  };

  const openComfirmModal = () => {
    setIsConfirmModalOpen(true);
  };

  const openDeleteComfirmModal = () => {
    setIsDeleteConfirmModalOpen(true);
  };

  const openReportComfirmModal = () => {
    setIsReportConfirmModalOpen(true);
  };

  const feedReportBtn = () => {
    feedReport(parseInt(id))
      .then()
      .catch((error) => {
        setIsAlreadyReportConfirmModalOpen(true);
      })
      .finally(() => {
        setIsReportConfirmModalOpen(false);
      });
  };

  const closeConfirmModal = () => {
    setIsConfirmModalOpen(false);
    setIsDeleteConfirmModalOpen(false);
  };

  const handleDelete = () => {
    if (location.pathname.includes("diary")) {
      deleteDiary(parseInt(id));
    } else {
      deleteFeed(user.user_id, parseInt(id));
    }

    if (startsWithsMypage()) return;
    if (startsWithsHistory()) return;
    if (startsWithsDiary()) return;
    if (startsWithsLikes()) return;

    navigate("/");
  };

  const handleContentChange = (newContent: string) => {
    setIsContent(newContent);
  };

  const handleTrackNameChange = (newTrackName: string) => {
    setIsTrackName(newTrackName);
  };

  const emotions = ["행복", "슬픔", "기쁨", "후회", "평온", "분노", "공포", "놀람", "사랑"];

  const handleEmotionChange = (emotion: any) => {
    setSelectedEmotion(emotion);
    setIsEmotionOpen(!isEmotionOpen);
  };

  const handleBackgroundChange = (color: any) => {
    setSelectedBackground(color);
    setIsPaletteOpen(!isPaletteOpen);
  };

  const togglePalette = () => {
    if (isEmotionOpen === true) {
      setIsEmotionOpen(false);
    }
    setIsPaletteOpen(!isPaletteOpen);
  };

  const toggleEmotion = () => {
    if (isPaletteOpen === true) {
      setIsPaletteOpen(false);
    }
    setIsEmotionOpen(!isEmotionOpen);
  };

  const renderIcon = () => {
    if (location.pathname.includes("/read/")) {
      return (
        <div className="modal-header-btn">
          <div className="palette-read">{selectedEmotion}</div>
          {userId === user.user_id ? (
            <div className="palette-toggle-button" onClick={onUpdatePage}>
              수정
            </div>
          ) : null}
          {userId === user.user_id ? (
            <div className="palette-toggle-button" onClick={openDeleteComfirmModal}>
              삭제
            </div>
          ) : null}
          {userId !== user.user_id ? (
            <div className="palette-toggle-button" onClick={openReportComfirmModal}>
              신고
            </div>
          ) : null}
        </div>
      );
    } else if (location.pathname.includes(`/edit/${id}`)) {
      return (
        <div className="modal-header-btn">
          <div className="color-palette-dropdown">
            <button onClick={togglePalette} className="palette-toggle-button">
              {selectedBackground === "white" ? "배경 선택" : selectedBackground}
            </button>
            {isPaletteOpen && (
              <div className="color-palette">
                {backgroundOptions.map((background) => {
                  const isColor = background in colorMap;
                  const isImage = background in imageMap;

                  return (
                    <div
                      key={background}
                      className="color-option"
                      style={{
                        backgroundColor: isColor ? colorMap[background] : "transparent",
                        backgroundImage: isImage ? `url(${imageMap[background]})` : "none",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                      onClick={() => handleBackgroundChange(background)}
                    />
                  );
                })}
              </div>
            )}
          </div>
          <div className="emotion-palette-dropdown">
            <button onClick={toggleEmotion} className="palette-toggle-button">
              {selectedEmotion || "감정 선택"}
            </button>
            {isEmotionOpen && (
              <div className="emotion-palette">
                {emotions.map((emotion, index) => (
                  <div key={index} className="emotion-option" onClick={() => handleEmotionChange(emotion)}>
                    {emotion}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="palette-toggle-button" onClick={saveBtn}>
            저장
          </div>
        </div>
      );
    }
  };

  return (
    <>
      {isLoading ? (
        loadingDiv()
      ) : (
        <>
          <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="Diary Modal"
            overlayClassName="modal-overlay"
            className="modal-content"
          >
            <div className="modal-header">
              {renderModalTitle()}
              <FontAwesomeIcon className="modal-close-btn-icon fs-3" icon={faXmark} onClick={onRequestClose} />
            </div>
            <div className="modal-header">{renderIcon()}</div>
            <div style={{ height: "400px", marginTop: "16px" }}>
              <ModalCard
                id={id}
                isLiked={Liked}
                content={isContent}
                trackName={isTrackName}
                image={selectedBackground}
                user_id={user.user_id}
                cardClickHandler={null}
                toggleLike={toggleLike}
                handleContentChange={handleContentChange}
                handleTrackNameChange={handleTrackNameChange}
                isBookmarked={Bookmarked}
              />
            </div>
          </Modal>
          <Modal
            isOpen={isDeleteConfirmModalOpen}
            onRequestClose={closeConfirmModal}
            contentLabel="Confirm Deletion"
            overlayClassName="confirm-modal-overlay"
            className="confirm-modal-content"
          >
            <h5>정말 삭제하시겠습니까?</h5>
            <div className="confirm-modal-buttons">
              <button className="btn" onClick={handleDelete}>
                삭제
              </button>
              <button className="btn cancel" onClick={closeConfirmModal}>
                취소
              </button>
            </div>
          </Modal>
          <Modal
            isOpen={isConfirmModalOpen}
            onRequestClose={closeConfirmModal}
            contentLabel="Confirm Deletion"
            overlayClassName="confirm-modal-overlay"
            className="confirm-modal-content"
          >
            <h5>피드가 생성되었습니다.</h5>
            <div className="confirm-modal-buttons">
              <button className="btn" onClick={() => navigate("/")}>
                확인
              </button>
            </div>
          </Modal>
          <Modal
            isOpen={isReportConfirmModalOpen}
            onRequestClose={closeConfirmModal}
            contentLabel="Confirm Deletion"
            overlayClassName="confirm-modal-overlay"
            className="confirm-modal-content"
          >
            <h5>정말 신고하시겠습니까?</h5>
            <div className="confirm-modal-buttons">
              <button className="btn cancel" onClick={feedReportBtn}>
                예
              </button>
              <button className="btn" onClick={() => setIsReportConfirmModalOpen(false)}>
                아니오
              </button>
            </div>
          </Modal>
          <Modal
            isOpen={isAlreadyReportConfirmModalOpen}
            onRequestClose={closeConfirmModal}
            contentLabel="Confirm Deletion"
            overlayClassName="confirm-modal-overlay"
            className="confirm-modal-content"
          >
            <h5>신고 완료된 피드입니다</h5>
            <div className="confirm-modal-buttons">
              <button className="btn cancel" onClick={() => setIsAlreadyReportConfirmModalOpen(false)}>
                확인
              </button>
            </div>
          </Modal>
        </>
      )}
    </>
  );
};

export default ReadPostComponent;
