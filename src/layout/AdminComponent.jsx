import React, { useState } from "react";
import { Table, Pagination } from "react-bootstrap";
import { useFeeds } from "../context/FeedContext";
import { deleteReport } from "../api";

const AdminComponent = () => {
  const { reports } = useFeeds();

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = reports.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(reports.length / itemsPerPage);

  const handleClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const deleteReportBtn = (id) => {
    deleteReport(id);
  };

  return (
    <div className="container mt-5">
      <h1>Admin Page</h1>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>신고시간</th>
            <th>신고내용</th>
            <th>삭제</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((item) => (
            <tr key={item.reportId}>
              <td>{item.reportedTime}</td>
              <td>{item.reportContent}</td>
              <td
                className="btn"
                onClick={() => {
                  deleteReportBtn(item.mainfeedId);
                }}
              >
                삭제
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Pagination>
        <Pagination.First onClick={() => handleClick(1)} />
        <Pagination.Prev onClick={() => handleClick(currentPage > 1 ? currentPage - 1 : 1)} />
        {[...Array(totalPages)].map((_, index) => (
          <Pagination.Item key={index + 1} active={index + 1 === currentPage} onClick={() => handleClick(index + 1)}>
            {index + 1}
          </Pagination.Item>
        ))}
        <Pagination.Next onClick={() => handleClick(currentPage < totalPages ? currentPage + 1 : totalPages)} />
        <Pagination.Last onClick={() => handleClick(totalPages)} />
      </Pagination>
    </div>
  );
};

export default AdminComponent;
