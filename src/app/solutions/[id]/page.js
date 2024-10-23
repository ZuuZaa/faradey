'use client'

import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import '../../../i18n';
import { useParams  } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { UilSearch, UilCalender, UilCommentAltLines,UilArrowRight,UilArrowLeft     } from '@iconscout/react-unicons'
import BlogImg1 from '../../../../public/images/blogs/1.webp'
import BlogImg2 from '../../../../public/images/blogs/2.webp'
import BlogImg3 from '../../../../public/images/blogs/3.webp'

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

// import required modules
import { Pagination, Navigation, HashNavigation } from 'swiper/modules';

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
  const pathname = useParams();
  const id  = pathname.id;
  
  let lang_id='EN';
  async function fetchData(){
    if (typeof localStorage !== 'undefined') {
      if(localStorage.getItem("langId")!=null){
        lang_id=localStorage.getItem("langId");
      }
  }
  console.log(lang_id)
    const params = new URLSearchParams();
    params.append('Id',id)
    params.append('LanguageID',lang_id);
    const response = await fetch(`http://89.40.2.200:3461/api/solution/get-details?${params.toString()}`,{
        method: "GET",
        headers: {
          'Accept': 'application/json, text/plain',
          'Content-Type': 'application/json;charset=UTF-8'
        }
    })
    const data = await response.json();
    return data.output;
}
const [data, setData] = useState({ 
  solutions:[],
  solution: [], 
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

const solutions=data.solution;
const recentSolutions=data.recentSolutions;
var content="";
solutions.map(fet=>{
  content=fet.content;
  //console.log(fet.content)
  //document.getElementById("blog-detail").innerHTML=fet.content
})
    return (
    
        <main>
            {/* Breadcrumb */}
            <div className='breadcrumb-wrapper py-8'>
                <div className='custom-container mx-auto'>
                    <div className="flex" aria-label="Breadcrumb">
                        <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">

                            <li className="inline-flex items-center">
                            <a href="/" className="inline-flex items-center text-sm font-medium">{t('Home')}  </a>
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
            
            {/* Solution Detail Section */}
            <section className='solutions-detail-main-section my-20 py-3'>
                <div className='custom-container mx-auto'>
                  {
                    solutions.map(solution=>{
                      return(
                        <div className='solutions-detail-wrapper'>
                        
                        {/* Tag */}
                        {/* <div className='solutions-detail-tag'>
                            <span className='inline-block'>Iphone</span>
                        </div> */}

                        {/* Name */}
                        <div className='solutions-detail-name'>
                            <h5 className=''>{solution.title}</h5>
                        </div>

                        {/* Date-Comments */}
                        <div className='flex gap-4 align-center text-sm'>
                            <div className='flex gap-2 items-center '>
                                <UilCalender size='16' color='#333'/>
                                <span className='inline-block'>{solution.addDate.split('T')[0]}</span>
                            </div>
                            <div className='flex gap-2 items-center'>
                                <UilCommentAltLines  size='16' color='#333'/>
                                <span className='inline-block'>0 {t('comments')}</span>
                            </div>
                        </div>

                        {/* Image */}
                        <div className='solutions-detail-image my-8'>
                          <img src={solution.image} width={600} height={600} className='object-cover max-w-full' alt='Post'></img>
                            {/* <Image src={BlogImg1} width={600} height={600} className='object-cover max-w-full' alt='Post'/> */}
                        </div>

                        {/* Paragraph */}
                        <div className='solutions-detail-info' dangerouslySetInnerHTML={{ __html: content }}>
                            
                        </div>
                        
                        {/* Older Post  - Newer Post */}
                        {/* <div className='solutions-detail-older-newer flex justify-between mt-9 py-4'>
                                <Link href='' className='flex items-center hover-red'>
                                    <UilArrowLeft size='16' color='#333'/>
                                    Older Post
                                </Link>
                                <Link href='' className='flex items-center hover-red'>
                                    Newer Post
                                    <UilArrowRight size='16' color='#333'/>
                                </Link>
                        </div> */}
                        
                    </div>
                      )
                      
                    })
                  }
                    
                </div>
            </section>

            {/* Blog & Events */}
        <section className='blog-events-section mt-5 mb-16'>
          <div className='frd-container mx-auto mb-10'>
              <div className='flex justify-between items-center'>
                  <div className='section-title '>
                    <h2>{t('Recent Solutions')}</h2>
                  </div>
                  <Link href='/solutions' className='section-title-link flex items-center'>{t('View all Solutions')}<UilArrowRight size="24" color="#e4573d" /></Link>
              </div>
          </div>
          <div className='frd-container mx-auto'>
                <Swiper
                  breakpoints={{ 300: {slidesPerView: 1,}, 768: {slidesPerView: 2,}, 992: {slidesPerView: 3,}}}
                  spaceBetween={30}
                  loop={true}
                  autoplay={{
                    delay: 2500,
                    disableOnInteraction: false,
                  }}
                  hashNavigation={{
                    watchState: true,
                  }}
                  navigation={true}
                  modules={[ Navigation, HashNavigation]}
                  onSlideChange={() => console.log('slide change')}
                  onSwiper={(swiper) => console.log(swiper)}
                >

                  {
                    recentSolutions.map(solution=>{
                      return(
                        <SwiperSlide className='zoom-img blog-swiper-item'>
                      <Link href={`/solutions/${solution.id}`} className=''>
                        <div className='blog-swiper-item-img-wrap w-full overflow-hidden'>
                          <img src={solution.image} width={300} height={400} className='blog-swiper-item-img object-cover w-full h-full' alt='Solution'></img>
                          
                        </div>
                      </Link>
                      <div className='blog-swiper-item-content pt-5'>
                        <div className='blog-created-date flex items-center gap-2'>
                           <UilCalender size="18" color='#444'/>
                           <span className='text-sm'>{solution.addDate.split('T')[0]}</span>
                        </div>
                        <Link href={`/solutions/${solution.id}`} className='name mt-2 text-xl tracking-normal hover-red block'>{solution.title}</Link>
                      </div>
                  </SwiperSlide>

                      )
                    })

                  }
                  

                </Swiper>
            </div>
        </section>

        </main>
    )
}

