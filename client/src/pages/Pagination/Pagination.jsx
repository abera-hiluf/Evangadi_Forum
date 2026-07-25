// src/components/Pagination.js
import React from "react";
import style from "../Answers/answer.module.css";
const Pagination = ({
  itemsPerPage,
  totalItems,
  currentPage,
  onPageChange,
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePrev = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  return (
    <div className={style.pagination}>
      <button
        onClick={handlePrev}
        disabled={currentPage === 1}
        className={style.pageButton}
      >
        &laquo; Previous
      </button>

      <p>
        {currentPage} / {totalPages}
      </p>

      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className={style.pageButton}
      >
        Next &raquo;
      </button>
    </div>
  );
};

export default Pagination;
