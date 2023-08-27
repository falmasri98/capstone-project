import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ReactPaginate from "react-paginate";
import "./StoresPage.css";

import Breadcrumb from "../../UI/Breadcrumb";

import { useHttpClient } from "../../hooks/http-hook";

export default function StroesPage() {
  const { sendRequest } = useHttpClient();
  const [allStores, setAllStores] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // For Pagination
  const [offset, setOffset] = useState(0);
  const [perPage] = useState(6);
  const [pageCount, setPageCount] = useState(0);

  const fetchAllStores = async () => {
    try {
      let responseData = await sendRequest(
        "http://localhost:5000/api/users/get-stores-list"
      );

      console.log(responseData);

      // setAllStores(responseData);
      const slice = responseData.slice(offset, offset + perPage);
      setAllStores(slice);
      setPageCount(Math.ceil(responseData.length / perPage));
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchAllStores();
  }, [offset]);

  const handlePageClick = (e) => {
    const selectedPage = e.selected;
    setOffset(selectedPage + 1);
  };

  return (
    <div className="store-page__container">
      <div className="stores-page__header">
        <img
          width="96"
          height="96"
          src="https://img.icons8.com/color/96/small-business.png"
          alt="small-business"
        />
        <h1 className="text-light fw-bold mb-2">Our Stores List</h1>
        <Breadcrumb prev={""} current={"stores"} />
      </div>

      <div className="stores-page__content">
        <div className="mb-5 store-searchbar">
          <input
            type="text"
            className="form-control"
            placeholder="Search for resturants, hotels, etc..."
            onChange={(e) => setSearchValue(e.target.value)}
          />
          <select
            className="form-select"
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="all" defaultValue>
              All
            </option>
            <option value="food">Food</option>
            <option value="sweet">Sweet</option>
          </select>
        </div>
        <div className="stores-list mb-5">
          {selectedCategory === "all" &&
            allStores
              ?.filter((store) => store.username.includes(searchValue))
              ?.map((store) => (
                <div key={store.id} className="card" style={{ width: "18rem" }}>
                  <img
                    src={`http://localhost:5000/${store.image}`}
                    className="card-img-top"
                    alt="Store"
                  />
                  <div className="card-body">
                    <h5 className="card-title text-capitalize fw-bold">
                      {store.username}
                    </h5>
                    <p className="card-text">
                      Some quick example text to build on the card title and
                      make up the bulk of the card's content.
                    </p>
                    <Link
                      to={`/stores/${store.id}`}
                      className="btn btn-primary text-light me-4"
                    >
                      View Store
                    </Link>
                    {store.menu && (
                      <Link
                        to={`${store.menu}`}
                        className="btn btn-primary text-light"
                      >
                        View Menu
                      </Link>
                    )}
                  </div>
                </div>
              ))}
          {selectedCategory !== "all" &&
            allStores
              ?.filter((store) => store.category === selectedCategory)
              ?.map((store) => (
                <div key={store.id} className="card" style={{ width: "18rem" }}>
                  <img
                    src={`http://localhost:5000/${store.image}`}
                    className="card-img-top"
                    alt="Store"
                  />
                  <div className="card-body">
                    <h5 className="card-title text-capitalize fw-bold">
                      {store.username}
                    </h5>
                    <p className="card-text">
                      Some quick example text to build on the card title and
                      make up the bulk of the card's content.
                    </p>
                    <Link
                      to={`/stores/${store.id}`}
                      className="btn btn-primary text-light me-4"
                    >
                      View Store
                    </Link>
                    {store.menu && (
                      <Link
                        to={`${store.menu}`}
                        className="btn btn-primary text-light"
                      >
                        View Menu
                      </Link>
                    )}
                  </div>
                </div>
              ))}
        </div>
        <ReactPaginate
          previousLabel={"prev"}
          nextLabel={"next"}
          breakLabel={"..."}
          breakClassName={"break-me"}
          pageCount={pageCount}
          marginPagesDisplayed={2}
          pageRangeDisplayed={6}
          onPageChange={handlePageClick}
          containerClassName={"pagination"}
          subContainerClassName={"pages pagination"}
          activeClassName={"active"}
        />
      </div>
    </div>
  );
}
