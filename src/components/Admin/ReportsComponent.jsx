import { useState, useEffect } from "react";
import { Table, Pagination } from "react-bootstrap";
import { applySuspesion, deleteReport, findAllReportSize } from "../../api";
import "../Admin/Admin.css";
import Modal from "react-modal";
import { useFeeds } from "../../context/FeedContext";

const ReportsComponent = () => {
  const { reports, setReports, page, setPage, setIsFetching, setReportsInitialLoad, loading } = useFeeds();
  const [isDeleteConfirmModalOpen, setIsDeleteConfirmModalOpen] = useState(false);
  const [isSuspensionConfirmModalOpen, setIsSuspensionConfirmModalOpen] = useState(false);
  const [selectedMainfeedId, setSelectedMainfeedId] = useState(null);
  const [selectedMainfeedUserId, setSelectedMainfeedUserId] = useState(null);
  const [itemsPerPage] = useState(10); // 페이지당 표시할 항목 수는 고정
  const [totalItems, setTotalItems] = useState(0); // 전체 항목 수를 위한 상태

  useEffect(() => {
    const getReportSize = async () => {
      try {
        const reportSize = await findAllReportSize();
        setTotalItems(reportSize);
      } catch (error) {
        console.error("Error fetching report size:", error);
      }
    };

    getReportSize();
  }, []);

  if (loading) {
    return <div className="center-message">로딩 중...</div>;
  }

  let message = null;

  if (reports === undefined) {
    message = <div className="center-message">목록을 불러오지 못했습니다.</div>;
  } else if (reports.length === 0) {
    message = <div className="center-message">신고된 피드가 없습니다.</div>;
  }

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handleClick = (pageNumber) => {
    setReports(reports);
    setIsFetching(true);
    setReportsInitialLoad(false);
    setPage(pageNumber - 1);
  };

  const openConfirmModal = (mainfeedId) => {
    setSelectedMainfeedId(mainfeedId);
    setIsDeleteConfirmModalOpen(true);
  };

  const openSuspensionConfirmModal = (userId) => {
    setSelectedMainfeedUserId(userId);
    setIsSuspensionConfirmModalOpen(true);
  };

  const handleDelete = () => {
    deleteReport(selectedMainfeedId);
    closeConfirmModal();
  };

  const handleSuspension = () => {
    applySuspesion(selectedMainfeedUserId);
    closeConfirmModal();
  };

  const closeConfirmModal = () => {
    setIsDeleteConfirmModalOpen(false);
    setIsSuspensionConfirmModalOpen(false);
  };

  return (
    <>
      {message}
      {reports && reports.length > 0 && (
        <div className="container mt-5">
          <div className="table-container">
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>신고시간</th>
                  <th>신고당한 유저</th>
                  <th>신고내용</th>
                  <th>삭제</th>
                  <th>정지</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((item) => (
                  <tr key={item.reportId}>
                    <td>{item.reportedTime}</td>
                    <td>{item.mainfeedUserId}</td>
                    <td>{item.reportContent}</td>
                    <td
                      className="delete-btn"
                      onClick={() => {
                        openConfirmModal(item.mainfeedId);
                      }}
                    >
                      삭제
                    </td>
                    <td
                      className="delete-btn"
                      onClick={() => {
                        openSuspensionConfirmModal(item.mainfeedUserId);
                      }}
                    >
                      정지
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
            isOpen={isSuspensionConfirmModalOpen}
            onRequestClose={closeConfirmModal}
            contentLabel="Confirm Deletion"
            overlayClassName="confirm-modal-overlay"
            className="confirm-modal-content"
          >
            <h5>정말 정지하시겠습니까?</h5>
            <div className="confirm-modal-buttons">
              <button className="btn" onClick={handleSuspension}>
                정지
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

export default ReportsComponent;
