import React from 'react'
import ReactPaginate from 'react-paginate';
import {BsChevronLeft,BsChevronRight}  from "react-icons/bs";
import { motion } from 'framer-motion';

const PaginationButtons = () => {
    const paginationVariants = {
        hidden:{
            opacity:0,
            y:200,
        },
        visible:{
            opacity:1,
            y:0,
            transition:{
                type : "spring",
                stiffness: 260,
                damping: 20,
                duration: 1,
            }
        }
    }
  return (
    <motion.div 
        variants={paginationVariants} 
        initial="hidden" 
        animate="visible">
        <ReactPaginate
            breakLabel={<span className="mr-4">...</span>}
            nextLabel={
                <span className="w-10 h-10 flex items-center justify-center bg-lightGray rounded-md">
                    <BsChevronRight />
                </span>
            }
            // onPageChange={handlePageClick}
            pageRangeDisplayed={5}
            pageCount={50}
            previousLabel={
                <span className="w-10 h-10 flex items-center justify-center bg-lightGray rounded-md mr-4">
                    <BsChevronLeft />
                </span>
            }
            containerClassName="flex items-center justify-center mt-8 mb-4"
            pageClassName="block border- border-solid border-lightGray hover:bg-lightGray w-10 h-10 flex items-center justify-center rounded-md"
            activeClassName="bg-primary text-white"
        />
    </motion.div>
  )
}

export default PaginationButtons