import React from "react";
import Category from "./Category";
import Hero from "./Hero";
import { Link } from "react-router-dom";
import Heading from "../../components/heading/Heading";

function Home() {
  return (
    <>
      <Hero />
      <Link to="/products"></Link>

      <section class="py-24 relative">
        <div class="w-full max-w-7xl mx-auto px-4 md:px-8">
          <div class="flex flex-col lg:flex-row lg:items-center max-lg:gap-4 justify-between w-full">
            <ul class="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-12">
              <li class="flex items-center cursor-pointer outline-none group">
                <span class="font-normal text-lg leading-8 text-indigo-600 ml-2 mr-3 transition-all duration-500 group-hover:text-indigo-600">
                  Category
                </span>
                <button class="flex aspect-square h-6 rounded-full border border-indigo-600  items-center justify-center font-manrope font-medium text-base text-indigo-600  transition-all duration-500 group-hover:border-indigo-600 group-hover:text-indigo-600">
                  x
                </button>
              </li>

              <li class="flex items-center cursor-pointer outline-none group">
                <span class="font-normal text-lg leading-8 text-black pl-2 pr-3 transition-all duration-500 group-hover:text-indigo-600">
                  Location{" "}
                </span>
                <span class="w-6 h-6 rounded-full border border-gray-900 flex items-center justify-center font-manrope font-medium text-base text-gray-900 transition-all duration-500 group-hover:border-indigo-600 group-hover:text-indigo-600">
                  x
                </span>
              </li>
            </ul>
            <div class="relative w-full max-w-sm">
              <form class="max-w-md mx-auto">
                <div class="relative">
                  <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                    <svg
                      class="w-4 h-4 text-gray-500 "
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 20 20"
                    >
                      <path
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                      />
                    </svg>
                  </div>
                  <input
                    type="search"
                    id="default-search"
                    class="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-green-500 focus:border-green-500 "
                    placeholder="Search produce..."
                    required
                  />
                  <button
                    type="submit"
                    class="text-white absolute end-2.5 bottom-2.5 bg-green-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 "
                  >
                    Search
                  </button>
                </div>
              </form>
            </div>
          </div>
          <svg
            class="my-7 w-full"
            xmlns="http://www.w3.org/2000/svg"
            width="1216"
            height="2"
            viewBox="0 0 1216 2"
            fill="none"
          >
            <path d="M0 1H1216" stroke="#E5E7EB" />
          </svg>
          <div class="grid grid-cols-12">
            <div class="col-span-12 md:col-span-3 w-full max-md:max-w-md max-md:mx-auto">
              <div class="box rounded-xl border border-gray-300 bg-white p-6 w-full md:max-w-sm">
                <h6 class="font-medium text-base leading-7 text-black mb-5">
                  Search by location
                </h6>

                <label
                  for="countries"
                  class="block mb-2 text-sm font-medium text-gray-600 w-full"
                >
                  Zip Code
                </label>
                <input
                  type="search"
                  id="default-search"
                  class=" w-full p-2 mb-1 ps-10 text-sm text-gray-900 border border-gray-300 rounded-xl bg-gray-50 focus:ring-green-500 focus:border-green-500 "
                  placeholder="Search produce by location..."
                  required
                />
                <button class="w-full py-2.5 flex items-center justify-center gap-2 rounded-full bg-green-600 text-white font-semibold text-xs shadow-sm shadow-transparent transition-all duration-500 hover:bg-green-700 hover:shadow-indigo-200  ">
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
                      stroke-width="1.6"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                  Search
                </button>
              </div>

              <div class="mt-7 box rounded-xl border border-gray-300 bg-white p-6 w-full md:max-w-sm">
                <div class="flex items-center justify-between w-full pb-3 border-b border-gray-200 mb-7">
                  <p class="font-medium text-base leading-7 text-black ">
                    Filter Category
                  </p>
                  <p class="font-medium text-xs text-gray-500 cursor-pointer transition-all duration-500 hover:text-indigo-600">
                    RESET
                  </p>
                </div>

                <label
                  for="Offer"
                  class="font-medium text-sm leading-6 text-gray-600 mb-1"
                >
                  Categories
                </label>
                <div class="relative w-full mb-7">
                  <select
                    id="Offer"
                    class="h-12 border border-gray-300 text-gray-900 text-xs font-medium rounded-full block w-full py-2.5 px-4 appearance-none relative focus:outline-none bg-white"
                  >
                    <option selected>Select category to filter</option>
                    <option value="option 1">option 1</option>
                    <option value="option 2">option 2</option>
                    <option value="option 3">option 3</option>
                    <option value="option 4">option 4</option>
                  </select>
                  <svg
                    class="absolute top-1/2 -translate-y-1/2 right-4 z-50"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12.0002 5.99845L8.00008 9.99862L3.99756 5.99609"
                      stroke="#111827"
                      stroke-width="1.6"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </div>
                <p class="font-medium text-sm leading-6 text-black mb-3">
                  Availability
                </p>
                <div class="box flex flex-col gap-2">
                  <div class="flex items-center">
                    <input
                      id="checkbox-default-1"
                      type="checkbox"
                      value=""
                      class="w-5 h-5 appearance-none border border-gray-300  rounded-md mr-2 hover:border-indigo-500 hover:bg-indigo-100 checked:bg-no-repeat checked:bg-center checked:border-indigo-500 checked:bg-indigo-100 checked:bg-[url('https://pagedone.io/asset/uploads/1689406942.svg')]"
                    />
                    <label
                      for="checkbox-default-1"
                      class="text-xs font-normal text-gray-600 leading-4 cursor-pointer"
                    >
                      20% or more
                    </label>
                  </div>
                  <div class="flex items-center">
                    <input
                      id="checkbox-default-2"
                      type="checkbox"
                      value=""
                      class="w-5 h-5 appearance-none border border-gray-300  rounded-md mr-2 hover:border-indigo-500 hover:bg-indigo-100 checked:bg-no-repeat checked:bg-center checked:border-indigo-500 checked:bg-indigo-100 checked:bg-[url('https://pagedone.io/asset/uploads/1689406942.svg')]"
                    />
                    <label
                      for="checkbox-default-2"
                      class="text-xs font-normal text-gray-600 leading-4 cursor-pointer"
                    >
                      30% or more
                    </label>
                  </div>
                  <div class="flex items-center">
                    <input
                      id="checkbox-default-3"
                      type="checkbox"
                      value=""
                      class="w-5 h-5 appearance-none border border-gray-300  rounded-md mr-2 hover:border-indigo-500 hover:bg-indigo-100 checked:bg-no-repeat checked:bg-center checked:border-indigo-500 checked:bg-indigo-100 checked:bg-[url('https://pagedone.io/asset/uploads/1689406942.svg')]"
                    />
                    <label
                      for="checkbox-default-3"
                      class="text-xs font-normal text-gray-600 leading-4 cursor-pointer"
                    >
                      50% or more
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-span-12 md:col-span-9 px-3">
              <Category />
            </div>
          </div>
        </div>
      </section>

      {/* <div className="mx-auto w-11/12 mb-6 md:mb-12">

        <Heading text="Category" marginY="my-6 md:my-8" textAlign="text-center" />

      
      </div> */}
    </>
  );
}

export default Home;
