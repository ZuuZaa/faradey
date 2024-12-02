import "./pagination.css";

const Pagination = ({ totalPages, activePage, setPages }) => {
  const getVisiblePages = () => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (activePage <= 3) {
      return [1, 2, 3, 4, 5];
    }

    if (activePage > totalPages - 3) {
      return [
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    }

    return [
      activePage - 2,
      activePage - 1,
      activePage,
      activePage + 1,
      activePage + 2,
    ];
  };

  const visiblePages = getVisiblePages();

  return (
    <div className="pagination flex justify-center py-3">
      <ul className="flex justify-center gap-3">
        <li>
          <button
            className="prev"
            onClick={() => setPages(1)}
            disabled={activePage === 1}
          >
            &#8810;
          </button>
        </li>
        {visiblePages.map((page) => (
          <li key={page}>
            <button
              onClick={() => setPages(page)}
              className={page === activePage ? "page-btn active" : "page-btn"}
            >
              {page}
            </button>
          </li>
        ))}
        <li>
          <button
            className="next"
            onClick={() => setPages(totalPages)}
            disabled={activePage === totalPages}
          >
            &#x226B;
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Pagination;
