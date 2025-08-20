/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unknown-property */
/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
import React, { useState, useRef, useEffect } from "react";
import requester from "@sitevision/api/client/requester";
import router from "@sitevision/api/common/router";

const Search = (data) => {
  console.log(data);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [suggestedTerm, setSuggestedTerm] = useState('');
  const topRef = useRef(null); 

  const handleInputChange = (event) => {
    setSearchQuery(event.target.value);
    setHasSearched(false);
    setSearchResults([]);
    setCurrentPage(1);
  };

  useEffect(() => {
    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [currentPage]);

  const handleSearch = (page = currentPage, query = searchQuery, totPages = totalItems) => {
    let hitsPpage = data.data.splitpages ? data.data.hitsperpage : totalItems;
    const start = (page - 1) * hitsPpage;
    requester
      .doGet({
        url: router.getUrl("/Search"),
        data: { searchQuery: query, page: start, totalItems: totPages },
      })
      .then((response) => {
        console.log(response);
        const results = response.response.response.docs;
        const total = response.response.response.numFound || 0;
        const totalPages = Math.ceil(total / data.data.hitsperpage);
        const suggestion = response.response.suggestion || '';

        setSearchResults(results);
        setTotalItems(total);
        setTotalPages(totalPages);
        setHasSearched(true);
        setError(null);
        setSuggestedTerm(suggestion);

      })
      .catch((err) => {
        console.error("Error:", err);
        setSearchResults([]);
        setHasSearched(true);
        setError("Något gick fel");
      });
  };

  const handlePageChange = (page, event) => {
    event.preventDefault();
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    handleSearch(page);
  };

  const handleSearchWithSuggestion = (suggestion) => {
    setSearchQuery(suggestion); 
    handleSearch(1, suggestion);
  };

  return (
    <div ref={topRef} class="env-m-around--small">
      <form
        class="example-flex env-flex env-justify-content--between"
        onSubmit={(e) => {
          e.preventDefault();
          handleSearch();
        }}
      >
        <div class="env-form-element env-m-top--small" style={{ width: "100%" }}>
          <label htmlFor="search" class="env-form-element__label svhidden">
            Search
          </label>
          <div class="env-form-element__control">
            <input
              value={searchQuery}
              placeholder="Sök"
              type="text"
              class="env-form-input"
              onChange={handleInputChange}
              style={{ width: "100%", borderRadius: "0" }}
            />
          </div>
        </div>
        <div class="env-form-element env-justify-content--end">
          <button
            class="env-button env-button--primary env-m-left--small env-m-top--small"
            type="submit"
            style={{ borderRadius: "0" }}
          >
            <svg class="env-icon"><use href="/sitevision/envision-icons.svg#icon-search"></use></svg>
          </button>
        </div>
      </form>

      {error && data.data.checkboxerror && <p style={{ color: "red" }}>{error}</p>}
      {hasSearched && searchResults.length === 0 && !error && (
        <p>Det finns inga sökresultat för: {searchQuery}.</p>
      )}
    {suggestedTerm && data.data.suggestion === true && (
      <p>
        Menade du{" "}
        <span
          onClick={() => handleSearchWithSuggestion(suggestedTerm)}
          style={{
            color: "#007BFF",
            cursor: "pointer",
            textDecoration: "underline",
          }}
        >
          {suggestedTerm}
          
        </span>
        ?
      </p>
    )}
    {hasSearched && data.data.totalhits === true && (
    <p>Antal sökträffar: {totalItems}</p>
    )}
    
      {searchResults && (
        <div>
          {searchResults.map((doc, index) => (
            <div
              class="example-flex env-flex env-flex--direction-column env-border env-m-bottom--medium env-p-around--small"
              key={doc.id}
            >
            <h4>
              {data.data.hitcount === true && <span>{index + 1}. </span>}
              <a href={doc.sv_url} style={{ color: "#1E10A6" }}>
                <span
                  dangerouslySetInnerHTML={{
                    __html: doc.sv_highlight_title || doc.sv_title,
                  }}
                />
              </a>
            </h4>

              <p> 
                <span
                  dangerouslySetInnerHTML={{
                    __html:
                      doc.sv_highlight_summary.substring(0, data.numberofhits) ||
                      doc.sv_summary.substring(0, data.numberofhits) ||
                      (doc.sv_content
                        ? doc.sv_content.substring(0, data.numberofhits) + "..."
                        : "No description available."),
                  }}
                />
              </p>
              { data.data.timeandauthor === true && (
              <small>
                {doc.sv_created_by_name && (
                  <span>
                    <strong>Skapad av:</strong> {doc.sv_created_by_name} |{" "}
                  </span>
                )}
                {doc.sv_last_modified_date && (
                  <span>
                    <strong>Senast modifierad:</strong>{" "}
                    {new Date(Number(doc.sv_last_modified_date)).toLocaleString()}
                  </span>
                )}
              </small>
               )}
            </div>
          ))}
          {totalItems > data.data.hitsperpage && data.data.splitpages == true && hasSearched &&(
            <nav aria-label="Pagination example">
              <ul class="env-pagination env-pagination--center env-list">
                {currentPage > 1 && (
                  <li class="env-pagination__item">
                    <a
                      class="env-pagination__link"
                      href="#"
                      onClick={(event) => handlePageChange(currentPage - 1, event)}
                    >
                      <svg class="env-icon">
                        <use href="/sitevision/envision-icons.svg#icon-arrow-left"></use>
                      </svg>
                    </a>
                  </li>
                )}

                {currentPage > 2 && (
                  <li class="env-pagination__item">
                    <a
                      class="env-pagination__link"
                      href="#"
                      onClick={(event) => handlePageChange(1, event)}
                    >
                      1
                    </a>
                  </li>
                )}

                {[...Array(totalPages)]
                  .map((_, index) => index + 1)
                  .filter(
                    (page) =>
                      page === currentPage ||
                      (page >= currentPage - 1 && page <= currentPage + 1)
                  )
                  .map((page) => (
                    <li key={page} class="env-pagination__item">
                      <a
                        class="env-pagination__link"
                        href="#"
                        onClick={(event) => handlePageChange(page, event)}
                        aria-current={currentPage === page}
                        style={{
                          background: currentPage === page ? "#3A71AA" : "",
                          fontWeight: currentPage === page ? "bold" : "",
                        }}
                      >
                        {page}
                      </a>
                    </li>
                  ))}

                {currentPage < totalPages - 1 && (
                  <li class="env-pagination__item">
                    <a
                      class="env-pagination__link"
                      href="#"
                      onClick={(event) => handlePageChange(totalPages, event)}
                    >
                      {totalPages}
                    </a>
                  </li>
                )}

                {currentPage < totalPages && (
                  <li class="env-pagination__item">
                    <a
                      class="env-pagination__link"
                      href="#"
                      onClick={(event) => handlePageChange(currentPage + 1, event)}
                    >
                      <svg class="env-icon">
                        <use href="/sitevision/envision-icons.svg#icon-arrow-right"></use>
                      </svg>
                    </a>
                  </li>
                )}
              </ul>
            </nav>
          )}
        </div>
      )}
    </div>
  );
};

export default Search;
