import { useState, useEffect } from "react";
import { Table, Pagination } from "react-bootstrap";
import { applySuspesion, findSuspensionUsersSize } from "../../api";
import "../Admin/Admin.css";
import Modal from "react-modal";
import { useFeeds } from "../../context/FeedContext";

const SuspentionComponent = () => {
  const { suspensionUsers, setSuspensionUsers, page, setPage, setIsFetching, setInitialLoad, loading } = useFeeds();
  const [isSuspensionConfirmModalOpen, setIsSuspensionConfirmModalOpen] = useState(false);
  const [selectedMainfeedUserId, setSelectedMainfeedUserId] = useState(null);
  const [itemsPerPage] = useState(10); // 페이지당 표시할 항목 수는 고정
  const [totalItems, setTotalItems] = useState(0); // 전체 항목 수를 위한 상태

  useEffect(() => {
    const getSuspensionUsersSize = async () => {
      try {
        const suspensionUsersSize = await findSuspensionUsersSize();
        setTotalItems(suspensionUsersSize);
      } catch (error) {
        console.error("Error fetching report size:", error);
      }
    };

    getSuspensionUsersSize();
  }, []);

  if (loading) {
    return <div className="center-message">로딩 중...</div>;
  }

  let message = null;

  if (suspensionUsers === undefined) {
    message = <div className="center-message">목록을 불러오지 못했습니다.</div>;
  } else if (suspensionUsers.length === 0) {
    message = <div className="center-message">정지된 유저가 없습니다.</div>;
  }

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handleClick = (pageNumber) => {
    setSuspensionUsers(suspensionUsers);
    setIsFetching(true);
    setInitialLoad(false);
    setPage(pageNumber - 1);
  };

  const closeConfirmModal = () => {
    setIsSuspensionConfirmModalOpen(false);
  };

  const handleSuspension = () => {
    applySuspesion(selectedMainfeedUserId);
    closeConfirmModal();
  };

  const openSuspensionConfirmModal = (userId) => {
    setSelectedMainfeedUserId(userId);
    setIsSuspensionConfirmModalOpen(true);
  };

  return (
    <>
      {message}
      {suspensionUsers && suspensionUsers.length > 0 && (
        <div className="container mt-5">
          <div className="table-container">
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>이메일</th>
                  <th>유저</th>
                  <th>정지 해제</th>
                </tr>
              </thead>
              <tbody>
                {suspensionUsers.map((item, index) => (
                  <tr key={index}>
                    <td>{item.email}</td>
                    <td>{item.userId}</td>
                    <td
                      className="delete-btn"
                      onClick={() => {
                        openSuspensionConfirmModal(item.userId);
                      }}
                    >
                      정지 해제
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
          <div className="pagination-container">
            <Pagination>
              <Pagination.First onClick={() => handleClick(1)} />
              <Pagination.Prev onClick={() => handleClick(page > 0 ? page : 1)} />
              {[...Array(totalPages)].map((_, index) => (
                <Pagination.Item key={index + 1} active={index === page} onClick={() => handleClick(index + 1)}>
                  {index + 1}
                </Pagination.Item>
              ))}
              <Pagination.Next onClick={() => handleClick(page < totalPages - 1 ? page + 2 : totalPages)} />
              <Pagination.Last onClick={() => handleClick(totalPages)} />
            </Pagination>
          </div>
          <Modal
            isOpen={isSuspensionConfirmModalOpen}
            onRequestClose={closeConfirmModal}
            contentLabel="Confirm Deletion"
            overlayClassName="confirm-modal-overlay"
            className="confirm-modal-content"
          >
            <h5>정말 해제하시겠습니까?</h5>
            <div className="confirm-modal-buttons">
              <button className="btn" onClick={handleSuspension}>
                해제
              </button>
              <button className="btn cancel" onClick={closeConfirmModal}>
                취소
              </button>
            </div>
          </Modal>
        </div>
      )}
    </>
  );
};

export default SuspentionComponent;
