'use client'

import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import '../../i18n'
import Link from 'next/link';
import Image from 'next/image';
import {UilCalender, UilArrowRight} from '@iconscout/react-unicons'



  
export default function Solutions() {
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
        const response = await fetch(`http://89.40.2.200:3461/api/solution/get-index?${params.toString()}`);
        const data = await response.json();
        return data.output;
    }
    const [data, setData] = useState({ 
        solutions: [], 
        recentSolutions: []
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

    const solutions = data.solutions; 
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
                            <a href="#" className="ms-1 text-sm font-medium md:ms-2">{t('Solutions')}</a>
                        </div>
                        </li>

                    </ol>
                    </div>
                </div>
            </div>
            
            {/* Solution Section */}
            <section className='solutions-main-section my-20 py-3'>
                <div className='custom-container mx-auto'>
                    <div className='solutions-grid flex'>                     
                        <div className='solutions-main-list w-full px-4'>
                            <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-8'>
                                {
                                    solutions.map(solution=>{
                                        return(
                                        <div className='solution-items'>
                                            <div className='img relative'>
                                                <img src={solution.image} width={400} height={300} className='w-full mx-auto object-cover max-w-full' alt='Post'></img>
                                                {/* <Image src={BlogImg1} width={400} height={300} className='w-full mx-auto object-cover max-w-full' alt='Post'/> */}
                                                {/* <div className='solution-items-tag'>
                                                    <span className='inline-block'>{solution.title}</span>
                                                </div> */}
                                            </div>
                                            <div className='content'>
                                                <div className='flex gap-4 align-center text-sm'>
                                                    <div className='flex gap-2 items-center '>
                                                        <UilCalender size='16' color='#333'/>
                                                        <span className='inline-block'>{solution.addDate.split('T')[0]}</span>
                                                    </div>
                                                    {/* <div className='flex gap-2 items-center'>
                                                        <UilCommentAltLines  size='16' color='#333'/>
                                                        <span className='inline-block'>0 comments</span>
                                                    </div> */}
                                                </div>
                                                <Link href={`solutions/${solution.id}`}><h4 className='hover-red w-4/5 text-xl mt-4 mb-6'>{solution.title}</h4></Link>
                                                <Link href={`solutions/${solution.id}`} className='flex hover-red gap-2 items-center solution-items-read-more font-semibold'>{t('Read more')} <UilArrowRight size='16' color='#e52e06'/></Link>
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

