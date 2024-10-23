'use client'

import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import '../../i18n'
import Link from 'next/link';
import Image from 'next/image';
import { UilCalender, UilCommentAltLines,UilArrowRight} from '@iconscout/react-unicons'




  
export default function Blogs() {
    const { t, i18n } = useTranslation();
      
    const changeLanguage = async (event) => {
        const lng=event.currentTarget.textContent
        await i18n.changeLanguage(lng);
        if(typeof localStorage !== 'undefined') {
            localStorage.setItem("langId",lng)
        }
        const fetchedData = await fetchData();
        setData(fetchedData);
    
    };
    let lang_id='EN';
    async function fetchData(){
        if (typeof localStorage !== 'undefined') {
            if(localStorage.getItem("langId")!=null){
              lang_id=localStorage.getItem("langId");
            }
            
        }
        const params = new URLSearchParams();
        params.append('LanguageID',lang_id);
        const response = await fetch(`http://89.40.2.200:3461/api/blog/get-index?${params.toString()}`);
        const data = await response.json();
        return data.output;
    }
    const [data, setData] = useState({ 
                                    blogs: [], 
                                    recentBlogs: []
                                    });
    
    useEffect(() => {
        
      async function fetchDataAsync() {
        
        const fetchedData = await fetchData();
            setData(fetchedData);
            await i18n.changeLanguage(lang_id);
        }
  
      fetchDataAsync();
    }, []);
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
    const blogs = data.blogs; 
    const recentBlogs = data.recentBlogs;
    
    return (
    
        <main>
            {/* Breadcrumb */}
            <div className='breadcrumb-wrapper py-8'>
                <div className='custom-container mx-auto'>
                    <div className="flex" aria-label="Breadcrumb">
                    <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">

                        <li className="inline-flex items-center">
                        <a href="/" className="inline-flex items-center text-sm font-medium"> {t('Home')} </a>
                        </li>

                        <li>
                        <div className="flex items-center">
                            <a href="#" className="ms-1 text-sm font-medium md:ms-2">{t('Blogs')}</a>
                        </div>
                        </li>

                    </ol>
                    </div>
                </div>
            </div>
            
            {/* Blogs Section */}
            <section className='blogs-main-section my-20 py-3'>
                <div className='custom-container mx-auto'>
                    <div className='blogs-grid flex'>
                        <div className='blogs-filter w-1/3 px-4'>
                            <div className='md:pr-8'>
                               
                                {/* Search Blogs */}
                                {/* <div className='blogs-filter-search mb-5 blogs-filter-wrap'>
                                    <h5 className='text-xl mb-6 font-medium'>Search</h5>
                                    <div className='relative flex'>
                                        <input className='' type='text' placeholder='Search our store'/>
                                        <button className='absolute'><UilSearch size='16' color='#333'/></button>
                                    </div>
                                </div> */}

                                {/* Recent Post */}
                                <div className='blogs-filter-recent mb-5 blogs-filter-wrap'>
                                     <h5 className='text-xl mb-6 font-medium'>{t('Recent Post')}</h5>
                                    {/* Post */}
                                    {
                                        recentBlogs.map(blog=>{
                                            return(
                                                <div className='blogs-filter-recent-post-box flex'>
                                                    <div className='img mr-4'>
                                                        <img src={blog.image} width={100} height={100} className='mx-auto object-cover' alt='Post'></img>
                                                    </div>
                                                    <div className='content'>
                                                        <Link href={`blogs/${blog.id}`} key={blog.id} passHref={true} ><h6 className='hover-red w-4/5'>{blog.title}</h6></Link>
                                                        <span  className='text-sm mt-2'>{blog.addDate.split('T')[0]}</span>
                                                    </div>
                                                </div>
                                            )
                                        })
                                    }
                                </div>


                            </div>
                        </div>
                        <div className='blogs-main-list  w-2/3 px-4'>
                            <div className='grid md:grid-cols-2 gap-8'>
                                {
                                    blogs.map(blog=>{
                                        return(
                                        <div className='blog-items'>
                                            <div className='img relative'>
                                                <img src={blog.image} width={400} height={300} className='w-full mx-auto object-cover max-w-full' alt='Post'></img>
                                                {/* <div className='blog-items-tag'>
                                                    <span className='inline-block'>Iphone</span>
                                                </div> */}
                                            </div>
                                            <div className='content'>
                                                <div className='flex gap-4 align-center text-sm'>
                                                    <div className='flex gap-2 items-center '>
                                                        <UilCalender size='16' color='#333'/>
                                                        <span className='inline-block'>{blog.addDate.split('T')[0]}</span>
                                                    </div>
                                                    <div className='flex gap-2 items-center'>
                                                        <UilCommentAltLines  size='16' color='#333'/>
                                                        <span className='inline-block'>0 {t('comments')}</span>
                                                    </div>
                                                </div>
                                                <Link href={`blogs/${blog.id}`} key={blog.id} passHref={true}><h4 className='hover-red w-4/5 text-xl mt-4 mb-6'>{blog.title}</h4></Link>
                                                <Link href={`blogs/${blog.id}`} key={blog.id} passHref={true} className='flex hover-red gap-2 items-center blog-items-read-more font-semibold'>{t('Read more')} <UilArrowRight size='16' color='#e52e06'/></Link>
                                            </div>
                                        </div>
                                    )
                                    })
                                }
                            
                                
                            </div>
                            <div className="pagination-wrapper flex items-center gap-4">
                                {/* Pagination */}

                            </div>
                        </div>
                    </div>        
                </div>
            </section>

        </main>
    )
}

