import { useContext, useEffect, useRef, useState } from "react";
import Modal from "react-modal";
import { AuthContext } from "../../context/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import { uploadUserImages } from "../../api";

const ProfilePictureUpload = () => {
  const { user } = useContext(AuthContext);

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previews, setPreviews] = useState([user.profile_image]);
  const [showModal, setShowModal] = useState(false); // 모달 상태 관리
  const fileInputRef = useRef(null);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.pathname.includes("/mypage/prof/update")) {
      setShowModal(true);
    }
  }, [location]);

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    setSelectedFiles(files);

    const filePreviews = files.map((file) => URL.createObjectURL(file));
    setPreviews(filePreviews);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (selectedFiles.length === 0) return;

    const formData = new FormData();
    selectedFiles.forEach((file, index) => {
      formData.append("image", file); // key를 "image"로 설정
    });

    const uploadUserImagesResponse = (images) => {
      if (images) {
        setShowModal(false); // 업로드 후 모달 닫기
        navigate(-1);
      }
    };
    uploadUserImages(formData).then(uploadUserImagesResponse);
  };

  const closeModal = () => {
    setShowModal(false);
    navigate(-1);
  };

  return (
    <>
      <Modal
        isOpen={showModal}
        onRequestClose={closeModal}
        contentLabel="Upload Profile Picture"
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          },
          content: {
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
            padding: "20px",
            borderRadius: "8px",
            maxWidth: "500px",
            width: "100%",
          },
        }}
      >
        <form onSubmit={handleSubmit}>
          <input type="file" ref={fileInputRef} onChange={handleFileChange} />
          {selectedFiles && <img src={previews} alt="Profile Preview" width="100" />}
          <button type="submit">Upload</button>
        </form>
      </Modal>
    </>
  );
};

export default ProfilePictureUpload;
