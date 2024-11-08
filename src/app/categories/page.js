'use client'

import {React, useEffect, useState} from 'react'
import { useTranslation } from 'react-i18next';
import '../../i18n'
import Link from 'next/link';
import Image from 'next/image'
import { UilPlus, UilMinus } from '@iconscout/react-unicons'
import ProductImg1 from '../../../public/images/products/1.webp';
import ProductImg2 from '../../../public/images/products/2.webp';
import { FaPlus, FaMinus } from 'react-icons/fa';
import {UisStar, UisAngleLeft, UisAngleRight} from '@iconscout/react-unicons-solid'
import { API_URL } from '@/constants';


export default function Categories() {
    const { t, i18n } = useTranslation();

  const changeLanguage = async (event) => {
    const lng=event.currentTarget.textContent
    //console.log(lng)
    await i18n.changeLanguage(lng);
    if(typeof localStorage !== 'undefined') {
        localStorage.setItem("langId",lng)
    }
    const fetchedData = await fetchData();
    setData(fetchedData);

};
let lang_id='EN';
async function fetchData(){
    let token="";
    let session_id="";
    if (typeof localStorage !== 'undefined') {
      
        token = localStorage.getItem("jwtToken");
        session_id=localStorage.getItem("sessionId");
        if(localStorage.getItem("langId")!=null){
          lang_id=localStorage.getItem("langId");
        }
        
    }
    console.log(lang_id)
    const params = new URLSearchParams();
    params.append('SessionId', session_id);
    params.append('LanguageID',lang_id);
    const response = await fetch(
      `${API_URL}/api/category/get-all?${params.toString()}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json, text/plain",
          "Content-Type": "application/json;charset=UTF-8",
          Authorization: "Bearer " + token,
        },
      }
    );
    const data = await response.json();
    return data.output;
  }
    const [data, setData] = useState({ 
                                mainCategories: [], 
                                categories: [],
                                subCategories:[]
    });

    useEffect(() => {
        // Get all elements with the class name 'lang_btn'
        const langBtns = document.getElementsByClassName('lang_btn');
    
        // Add click event listener to each button
        for (let i = 0; i < langBtns.length; i++) {
          langBtns[i].addEventListener('click', changeLanguage);
        }
    
        // Cleanup function to remove event listeners when the component unmounts
        return () => {
          for (let i = 0; i < langBtns.length; i++) {
            langBtns[i].removeEventListener('click', changeLanguage);
          }
        };
      }, []);
  useEffect(() => {
    async function fetchDataAsync() {
    const fetchedData = await fetchData();
      setData(fetchedData);
      await i18n.changeLanguage(lang_id);
    }
    fetchDataAsync();
  }, []);


    const mainCategories= data.mainCategories;
    const categories=data.categories;
    const subCategories= data.subCategories;

    const [toggle, setToggle] = useState([])

    let setToggleClick=(e)=>{
        let _this = e.currentTarget;
        _this.parentNode.closest(".pcategories-item").querySelector(".pcategories-more-info-wrap").classList.toggle("active")
        let plusIcon = _this.parentNode.closest(".pcategories-item").querySelectorAll("svg")[0]
        let minusIcon = _this.parentNode.closest(".pcategories-item").querySelectorAll("svg")[1]
        if (plusIcon.classList.contains("active")) {
            plusIcon.classList.remove("active")
            plusIcon.style.display = "none"

            minusIcon.classList.add("active")
            minusIcon.style.display = "block"
        } else {
            minusIcon.classList.remove("active")
            minusIcon.style.display = "none"

            plusIcon.classList.add("active")
            plusIcon.style.display = "block"
        }
        // setToggle()
    }

    const [currentPage, setCurrentPage] = useState(1);
const [itemsPerPage, setItemsPerPage] = useState(20); // Adjust as needed
const [activePage, setActivePage] = useState(1); // Track active page

// Function to filter and paginate data
const getFilteredAndPaginatedData = () => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const filteredData =mainCategories.flatMap(item => item);
    // .filter((button) => button.name.toLowerCase().includes(filter.toLowerCase()));

    // Pagination logic with ellipses
    const paginateWithDots = (currentPage, totalPages, adjacentPages) => {
        const pages = [];
        let ellipsesShown = false;

        // Left ellipses
        if (currentPage > (adjacentPages + 1)) {
            pages.push(1);
            if (currentPage > (adjacentPages + 2)) {
                pages.push('...');
            }
            ellipsesShown = true;
        }

        // Pages within range
        for (let page = Math.max(1, currentPage - adjacentPages); page <= Math.min(totalPages, currentPage + adjacentPages); page++) {
            pages.push(page);
        }

        // Right ellipses
        if (currentPage < (totalPages - adjacentPages)) {
            if (!ellipsesShown) {
                pages.push('...');
            }
            if (currentPage < (totalPages - adjacentPages - 1)) {
                pages.push(totalPages);
            }
        }

        return pages;
    };

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const paginatedPages = paginateWithDots(currentPage, totalPages, 2); // Adjust adjacent pages as needed

    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

    return { currentItems, paginatedPages };
};

const { currentItems, paginatedPages } = getFilteredAndPaginatedData();

const goToNextPage = () => {
   setCurrentPage(currentPage + 1);
   setActivePage(currentPage + 1);
   window.scrollTo(0, 0)
};
const goToPreviousPage = () => {
   setCurrentPage(currentPage - 1);
   setActivePage(currentPage - 1);
   window.scrollTo(0, 0)
};
const goToPage = (pageNumber) => {
   setCurrentPage(pageNumber);
   setActivePage(pageNumber);
   window.scrollTo(0, 0)
};
    const [activeIndex, setActiveIndex] = useState(null);
    const toggleActive = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <main>

            {/* Breadcrumb */}
            <div className='breadcrumb-wrapper py-8'>
                <div className='custom-container mx-auto'>
                    <div className="flex" aria-label="Breadcrumb">
                    <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">

                        <li className="inline-flex items-center">
                        <a href="/" className="inline-flex items-center text-sm font-medium text-gray-700 dark:text-gray-400"> {t('Home')} </a>
                        </li>

                        <li>
                        <div className="flex items-center">
                            <a href="#" className="ms-1 text-sm font-medium text-gray-700  md:ms-2 dark:text-gray-400">{t('Categories')}</a>
                        </div>
                        </li>

                    </ol>
                    </div>
                </div>
            </div>
            
            {/* Product Categories  Section Info */}
            <section className='pcategories-info-section mt-5'>
                <div className='frd-container mx-auto'>
                    <div>
                             <h1 className='text-center md:text-left text-xl md:text-4xl font-bold'>{t('Categories')}</h1>
                             
                             <div className='pgategories-main-grid md:flex gap-12'>

                             <div className='pgategories-left'>
                                {/* Categories Filter  */}
                                <div className='cf-categories-list mt-11'>
                                    
                                    {
                                        mainCategories.map(main=>{
                                            console.log(main,"main")
                                            return (
                                              <div>
                                                <h3 className="hover-red mt-6 text-lg font-semibold capitalize flex items-center justify-between cf-categories-list-item">
                                                  <Link href={`/category/${main.id}`}>
                                                    {main.name}
                                                  </Link>
                                                  {main.folder != 0 && (
                                                    <span
                                                      className="cursor-pointer"
                                                      onClick={() =>
                                                        toggleActive(main.id)
                                                      }
                                                    >
                                                      {activeIndex ===
                                                      main.id ? (
                                                        <FaMinus />
                                                      ) : (
                                                        <FaPlus />
                                                      )}
                                                    </span>
                                                  )}
                                                </h3>
                                                <div
                                                  className={`pl-6 ${
                                                    activeIndex === main.id
                                                      ? "open"
                                                      : ""
                                                  }`}
                                                >
                                                  {categories
                                                    .filter(
                                                      (cat) =>
                                                        cat.mainId == main.id
                                                    )
                                                    .map((cat) => {
                                                      return (
                                                        <Link
                                                          href={
                                                            "/category/" +
                                                            cat.id
                                                          }
                                                        >
                                                          <h6 className="hover-red mt-2 font-medium hover:underline capitalize">
                                                            {cat.name}
                                                          </h6>
                                                        </Link>
                                                      );
                                                    })}
                                                </div>
                                              </div>
                                              // <div class='active'>
                                              //     <Link href={"/category/" + main.id}><h3 className='hover-red mt-6 text-lg font-semibold capitalize'>{main.name}</h3></Link>
                                              //     {
                                              //             categories.filter(cat=>cat.mainId==main.id).map(cat=>{
                                              //                 return(
                                              //                     <div className='pl-6'>
                                              //                         <Link href={"/category/" + cat.id}><h6 className='hover-red mt-2 font-medium hover:underline capitalize'>{cat.name}</h6></Link>

                                              //                     </div>

                                              //                 )

                                              //             })
                                              //         }

                                              // </div>
                                            );
                                        })
                                    }
                                </div>
                            </div>

                            <div className='pgategories-right'>
                                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-2 md:gap-7 mt-11">
                                {
                                    currentItems.map(main=>{
                                        if(main.folder==1){
                                            return(
                                                <div className='pcategories-item relative'>
                                                    <div className='img zoom-img'>
                                                    <Link href={"/category/" + main.id}>
                                                        <img src={main.image} width={300} height={400} className='category-product-item-img object-cover w-full h-full' alt='Product'></img>
                                                        
                                                    </Link>
                                                    </div>
                                                    <div className='info flex flex-row p-4 justify-between items-center'>
                                                        <h4 className='text-lg'>{main.name}</h4>
                                                        <UilPlus size='22' color='#333' onClick={ setToggleClick } style={{display: 'block'}} className={'active'} />  
                                                        <UilMinus size='22' color='#333' onClick={ setToggleClick } style={{display: 'none'}} />   
                                                        <div  className={ `${toggle ? "pcategories-more-info-wrap" : "pcategories-more-info-wrap active"} ` }>
                                                        <ul>
                                                            { 
                                                                categories.filter(c=>c.mainId==main.id).map(cat=>{
                                                                    return(
                                                                        <li className='nav-dropdown-item'>
                                                                            <Link href={"/category/" + cat.id}><li className='hover-red hover:pl-1'>{cat.name}</li></Link>
                                                                            {/* <Link href={'a'} className='nav-dropdown-link'>{cat.name}</Link> */}
                                                                        </li>
                                                                    )
                                                                    
                                                                })
                                                            }
                                                            
                                                        </ul>
                                                    </div>             
                                                    </div>
                                                    
                                                </div>
                                                )
                                        }
                                        else if(main.folder==0){
                                            return(
                                                <div className='pcategories-item'>
                                                    <div className='img zoom-img'>
                                                    <Link href={"/category/" + main.id}>
                                                        <img src={main.image} width={300} height={400} className='category-product-item-img object-cover w-full h-full' alt='Product'></img></Link>
                                                    </div>
                                                    <div className='info flex flex-row p-4 justify-between items-center'>
                                                        <h4 className='text-lg'>{main.name}</h4>
                                                        <UilPlus size='22' color='#333'/>                
                                                    </div>
                                                </div>
                                            )

                                        }
                                    })
                                }

                                </div>

                                {/* Pagination Wrapper */}
                                <div className='pagination-wrapper'>
                                    <button onClick={goToPreviousPage} disabled={currentPage === 1}>
                                    <UisAngleLeft size="18" color="#ffc400" />
                                    </button>
                                        {paginatedPages.map((page, index) => (
                                            <span key={index}>
                                                {page === '...' ? (
                                                    <span>...</span>
                                                ) : (
                                                    <button onClick={() => goToPage(page)} className={ activePage === page ? 'active_pag_btn' : '' }>{page}</button>
                                                )}
                                            </span>
                                        ))}
                                    <button onClick={goToNextPage} disabled={currentPage === Math.ceil(mainCategories.length / itemsPerPage)}>
                                        <UisAngleRight size="18" color="#ffc400" />
                                    </button>
                                 </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>


        </main>
    )
}

