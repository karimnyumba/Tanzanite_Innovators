import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useProducts from "../../hooks/products/useProducts";
import ProductCard from "../../components/products/ProductCard";
import ProductSkeleton from "../../components/skeleton/ProductSkeleton";
import Hero from "./Hero";
import Category from "./Category";

function Home() {
  const productsPerPage = 4;

  const [productData, setProductData] = useState([]);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const [searchCategory, setSearchCategory] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const { getProductData, isLoading } = useProducts();
  const [isReachingEnd, setIsReachingEnd] = useState(false);

  // Fetching product data
  const fetchProductData = async () => {
    const data = await getProductData();
    setProductData(data);
    setFilteredProducts(data);
  };

  useEffect(() => {
    fetchProductData();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [searchQuery, searchLocation, searchCategory, productData]);

  const filterProducts = () => {
    let filtered = productData;

    if (searchQuery) {
      filtered = (filtered||[]).filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (searchLocation) {
      filtered = (filtered||[]).filter((product) =>{
        const location = product.location ? `${product.location.latitude},${product.location.longitude}` : ""
      

        location.toLowerCase().includes(searchLocation.toLowerCase())
      }
      );
    }

    if (searchCategory) {
      filtered = (filtered||[]).filter((product) =>
        product.category.toLowerCase().includes(searchCategory.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleLocationChange = (e) => {
    setSearchLocation(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setSearchCategory(e.target.value);
  };

  const loadMore = () => {
    if (filteredProducts.length > page * productsPerPage) {
      setPage((prevPage) => prevPage + 1);
    } else {
      setIsReachingEnd(true);
    }
  };

  return (
    <>
      <Hero />
      <Link to="/products"></Link>

      <section className="py-24 relative">
        <div className="w-full max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center max-lg:gap-4 justify-between w-full">
            <ul className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-12">
              <li className="flex items-center cursor-pointer outline-none group">
                <span className="font-normal text-lg leading-8  ml-2 mr-3 transition-all duration-500 ">
                {searchCategory}
                </span>
              {searchCategory && <span className="text-red-400 border-[1px] p-1 rounded-full">x</span>}
              </li>
              {/* <li className="flex items-center cursor-pointer outline-none group">
                <span className="font-normal text-lg leading-8 text-black pl-2 pr-3 transition-all duration-500 group-hover:text-indigo-600">
                  Location
                </span>
                <span className="w-6 h-6 rounded-full border border-gray-900 flex items-center justify-center font-manrope font-medium text-base text-gray-900 transition-all duration-500 group-hover:border-indigo-600 group-hover:text-indigo-600">
                  x
                </span>
              </li> */}
            </ul>

            <div className="relative w-full max-w-sm">
              <form className="max-w-md mx-auto">
                <div className="relative">
                  <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                    <svg
                      className="w-4 h-4 text-gray-500 "
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 20 20"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                      />
                    </svg>
                  </div>
                  <input
                    type="search"
                    id="default-search"
                    className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-green-500 focus:border-green-500"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    required
                  />
                  <button
                    type="submit"
                    className="text-white absolute end-2.5 bottom-2.5 bg-green-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2"
                  >
                    Search
                  </button>
                </div>
              </form>
            </div>
          </div>

          <svg
            className="my-7 w-full"
            xmlns="http://www.w3.org/2000/svg"
            width="1216"
            height="2"
            viewBox="0 0 1216 2"
            fill="none"
          >
            <path d="M0 1H1216" stroke="#E5E7EB" />
          </svg>

          <div className="grid grid-cols-12">
            <div className="col-span-12 md:col-span-3 w-full max-md:max-w-md max-md:mx-auto">
              <div className="box rounded-xl border border-gray-300 bg-white p-6 w-full md:max-w-sm">
                <h6 className="font-medium text-base leading-7 text-black mb-5">
                  Search by location
                </h6>

                <label
                  htmlFor="location-search"
                  className="block mb-2 text-sm font-medium text-gray-600 w-full"
                >
                  Zip Code
                </label>
                <input
                  type="search"
                  id="location-search"
                  className="w-full p-2 mb-1 ps-10 text-sm text-gray-900 border border-gray-300 rounded-xl bg-gray-50 focus:ring-green-500 focus:border-green-500"
                  placeholder="Search products by location..."
                  value={searchLocation}
                  onChange={handleLocationChange}
                  required
                />
                <button
                  type="button"
                  className="w-full py-2.5 flex items-center justify-center gap-2 rounded-full bg-green-600 text-white font-semibold text-xs shadow-sm shadow-transparent transition-all duration-500 hover:bg-green-700 hover:shadow-indigo-200"
                >
                  <svg
                    width="17"
                    height="16"
                    viewBox="0 0 17 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M14.4987 13.9997L13.1654 12.6663M13.832 7.33301C13.832 10.6467 11.1457 13.333 7.83203 13.333C4.51832 13.333 1.83203 10.6467 1.83203 7.33301C1.83203 4.0193 4.51832 1.33301 7.83203 1.33301C11.1457 1.33301 13.832 4.0193 13.832 7.33301Z"
                      stroke="white"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Search
                </button>
              </div>

              <div className="mt-7 box rounded-xl border border-gray-300 bg-white p-6 w-full md:max-w-sm">
                <div className="flex items-center justify-between w-full pb-3 border-b border-gray-200 mb-7">
                  <p className="font-medium text-base leading-7 text-black ">
                    Filter Category
                  </p>
                  <p
                    className="font-medium text-xs text-gray-500 cursor-pointer transition-all duration-500 hover:text-indigo-600"
                    onClick={() => setSearchCategory("")}
                  >
                    RESET
                  </p>
                </div>

                <label
                  htmlFor="category-search"
                  className="font-medium text-sm leading-6 text-gray-600 mb-1"
                >
                  Categories
                </label>
                <div className="relative w-full mb-7">
                  <select
                    className="block appearance-none w-full bg-gray-50 border border-gray-300 hover:border-gray-400 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
                    id="category-search"
                    value={searchCategory}
                    onChange={handleCategoryChange}
                  >
                   <option value="">All Categories</option>
                    <option value="Fruits">Fruits</option>
                    <option value="Vegetables">Vegetables</option>
                    <option value="Dairy">Dairy</option>
                    <option value="Rice">Rice</option>
                    <option value="Wheat">Wheat</option>
                    <option value="Nuts">Nuts</option>
                    <option value="Sugar">Sugar</option>
                    <option value="Spices">Spices</option>
                    <option value="Pulses">Pulses</option>
                  </select>
                </div>
              </div>
            </div>

           {
            searchCategory === "" && searchQuery === "" && searchLocation === "" ? 
            <div className="col-span-12 md:col-span-9 flex flex-wrap gap-7 px-3" >  <Category/> </div>:
            <div className="col-span-12 md:col-span-9 px-3" >
            <div className="grid gap-2 md:gap-8  grid-cols-2 lg:grid-cols-4 w-full mx-auto" >
            {isLoading && <div><ProductSkeleton noOfBoxes={8} /></div>}
            {!isLoading &&
              (filteredProducts || [])
                .slice(0, page * productsPerPage)
                .map((product) => (
                  <ProductCard key={product.id} data={product} />
                ))}
                {
                  filteredProducts.length === 0 && <div className="  text-gray-600  text-lg flex justify-center items-center transform translate-x-56 translate-y-1/2">

                  <p className="  ">No Product Found!</p>
                  </div>
                }
          </div>
          </div>
           }
          </div>
         
{/* 
          {!isReachingEnd && (
            <button
              onClick={loadMore}
              className="w-full py-2.5 flex items-center justify-center gap-2 rounded-full bg-green-600 text-white font-semibold text-xs shadow-sm shadow-transparent transition-all duration-500 hover:bg-green-700 hover:shadow-indigo-200 mt-6"
            >
              Load More
            </button>
          )} */}
        </div>
      </section>
    </>
  );
}

export default Home;
