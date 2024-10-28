'use client'
import React, { useState ,useEffect } from 'react'
import { useTranslation } from 'react-i18next';
import '../../i18n'
import Link from 'next/link';
import Image from 'next/image';
import { UilPhone, UilInfo, UilMap, UilEnvelope } from '@iconscout/react-unicons'
import BgIcon from '../../../public/images/testimonial-icon.webp';
import Vision from '../../../public/images/icons/icons/vision.png';
import Target from '../../../public/images/icons/icons/target.png';
import Promise from '../../../public/images/icons/icons/promise.png';
import { API_URL } from '@/constants';




function About() {

    const { t, i18n } = useTranslation();
      let lang_id = "EN";
      if (
        typeof localStorage !== "undefined" &&
        localStorage.getItem("langId") != null
      ) {
        lang_id = localStorage.getItem("langId");
      }
    
    async function fetchData(){
        const params = new URLSearchParams();
        params.append('LanguageID',lang_id);

        const response = await fetch(`${API_URL}/api/about/get-index?${params.toString()}`);
        const data = await response.json();
        return data.output;
    }

  const [data, setData] = useState({ 
                                    team: [], 
                                    settings: [], 
                                    ourVision: [], 
                                    ourPromise: [], 
                                    ourMision: [], 
                                    testimonials: [] 
                                    });
    
    useEffect(() => {
        
      async function fetchDataAsync() {
        
        const fetchedData = await fetchData();
            setData(fetchedData);
            await i18n.changeLanguage(lang_id);
        }
  
      fetchDataAsync();
    }, [lang_id]);

      
    const team = data.team; 
    const settings = data.settings;
    const ourVision = data.ourVision;
    const ourPromise = data.ourPromise;
    const ourMision = data.ourMision;
    const testimonials = data.testimonials;

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [subject, setSubject] = useState("");
    const [text, setText] = useState("");
    const [message, setMessage] = useState("");

    let handleSubmit = async (e) => {
        e.preventDefault();
        try {
          const res = await fetch(`${API_URL}/api/about/add-message`, {
            method: "POST",
            headers: {
              'Accept': 'application/json, text/plain',
              'Content-Type': 'application/json;charset=UTF-8'
            },
            body: JSON.stringify({
              Name: name,
              Email: email,
              Subject: subject,
              Message:text
            }),
          });
          const resJson = await res.json();
          if (res.status === 200) {
            setName("");
            setEmail("");
            setSubject("");
            setText("");
            setMessage(t('Message sent successfully'));
          } else {
            setMessage(t('Some error occured'));
          }
        } catch (err) {
          console.log(err);
        }
      };

      


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
                    <a href="#" className="ms-1 text-sm font-medium md:ms-2"> {t('About')}</a>
                  </div>
                </li>

              </ol>
            </div>
          </div>
        </div>
        
        {/* About Section */}
        <section className='about-main-section mt-5 pt-16'>
          <div className='frd-container mx-auto'>
            
            <div className=''>
              <h1 className='text-center md:text-left text-xl md:text-4xl font-bold mb-3'>{t('Say Hello to Faradey!')}</h1>
              <p className='text-center md:text-left '></p>
            </div>

            {/* About Grid Items*/}
            
            <div className='about-grid-wrapper mt-11 mb-20'>
                <div className='grid grid-cols-1 lg:grid-cols-3 gap-7'>
                    <div className='item p-9'>
                        <div className='icon'>
                            <Image src={Vision} width={60} height={60} className='' alt='Icon'/>
                        </div>
                        <div className='title my-6 font-medium'>
                            <h2 className='text-2xl'>{t('Our Vision')}</h2>
                        </div>
                         <div className='list'>
                            <ul>
                                {
                                    ourVision.map(vision=>{
                                        return(
                                            <li key={vision.id}>{vision.ourVision}</li>
                                        )
                                    })
                                }
                                
                            </ul>
                        </div> 
                    </div>
                    <div className='item p-9 active'>
                        <div className='icon'>
                            <Image src={Promise} width={60} height={60} className='' alt='Icon'/>
                        </div>
                        <div className='title my-6 font-medium'>
                            <h2 className='text-2xl'>{t('Our Promise')}</h2>
                        </div>
                        <div className='list'>
                            <ul>
                                {
                                    ourPromise.map(promise=>{
                                        return(
                                            <li key={promise.id}>{promise.ourPromise}</li>
                                        )
                                    })
                                }
                            </ul>
                        </div>
                    </div>
                    <div className='item p-9'>
                        <div className='icon'>
                            <Image src={Target} width={60} height={60} className='' alt='Icon'/>
                        </div>
                        <div className='title my-6 font-medium'>
                            <h2 className='text-2xl'>{t('Our Mision')}</h2>
                        </div>
                        <div className='list'>
                            <ul>
                                {
                                    ourMision.map(mision=>{
                                        return(
                                            <li key={mision.id}>{mision.ourMision}</li>
                                        )
                                    })
                                }
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
          </div>

          {/* Our Team */}
          <div className='custom-container mx-auto mb-11'>
            
            <div className='mb-11'>
              <h1 className='text-center md:text-left text-xl md:text-4xl font-bold mb-3'>{t('Meet Our Team')}</h1>
              <p className='text-center md:text-left '></p>
            </div>

            <div className='our-team-grid grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8'>
                {
                    team.map(member=>{
                        return(
                            <div className='item text-center' key={member.id}>
                                <div className='img zoom-img'>
                                    <img class="our-team-item-img object-cover w-full h-full mb-5" src={member.image} width="300" height="400" alt={member.firstname} key={member.id}></img>
                                    {/* <Image src={Team1} width={300} height={400} className='our-team-item-img object-cover w-full h-full mb-5'/> */}
                                </div>
                                <div className='p-4'>
                                    <h5 className='text-lg mb-2'>{member.firstname} {member.lastname}</h5>
                                    <p>{member.position}</p>
                                    <p>{member.email}</p>
                                    <p>{member.phone}</p>
                                </div>
                            </div>
                        )
                    })
                }
                
            </div>

          </div>

            {/* Ask us anything here */}
          <div className='custom-container mx-auto'>
            <div className='askanything-wrapper pt-20 pb-16'>
                <div className='grid items-center gap-5'>
                        <div className='form p-16'>
                             <form className="w-full" onSubmit={handleSubmit}>

                                <h1 className='text-center text-2xl md:text-4xl font-semibold ls-5 mb-12'>{t('Ask us anything here')}</h1>
                                <div className="flex flex-wrap -mx-3">

                                    <div className="w-full md:w-1/2 px-3">
                                    
                                        <input className="appearance-none block w-full  border rounded-full py-3 px-4  leading-tight" 
                                            id="grid-first-name" 
                                            type="text" value={name}
                                            placeholder={t('Fullname')} onChange={(e) => setName(e.target.value)} />
                                    </div>

                                    <div className="w-full md:w-1/2 px-3">
                                        
                                        <input className="appearance-none block w-full border rounded-full py-3 px-4 leading-tight" 
                                            id="grid-last-name" 
                                            type="email" value={email}
                                            placeholder={t('Email')} onChange={(e) => setEmail(e.target.value)} />
                                    </div>

                                </div>
                                <div className="flex flex-wrap -mx-3">

                                    <div className="w-full px-3">
                                        
                                        <input className="appearance-none block w-full border rounded-full py-3 px-4 leading-tight" 
                                            id="grid-last-name" 
                                            type="text" value={subject}
                                            placeholder={t('Subject')} onChange={(e) => setSubject(e.target.value)} />
                                    </div>

                                </div>
                                
                                <div className="flex flex-wrap -mx-3">

                                    <div className="w-full px-3">
                                        
                                        <textarea name="postContent" value={text}
                                            className='appearance-none block w-full border rounded py-3 px-4 leading-tight' 
                                            placeholder={t('Message')} onChange={(e) => setText(e.target.value)}/>

                                    </div>

                                </div>

                                <div className=''>
                                    <button type="submit" className='inline-block border-none font-bold'>{t('Send message')}</button>
                                </div>
                                <div className="message">{message ? <p>{message}</p> : null}</div>
                            </form> 
                        </div>
                        {
                            settings.map(set=>{
                                return(
                                    <div className='info pl-10' key={set.id}>
                                        <div className='info-item flex gap-3 mb-14'>
                                                <div className='icon'>
                                                    <UilPhone  size="45" color="#e52e06" />
                                                </div>
                                                <div className='content'>
                                                    <h6>{t('Call for help now!')}</h6>
                                                    <Link href='tel:{set.phone}' className='inline-block text-3xl md:text-5xl font-bold hover-red'>{set.phone}</Link>
                                                </div>
                                        </div>         
                                        <div className='info-item flex gap-3 mb-14'>
                                                <div className='icon'>
                                                    <UilEnvelope size="45" color="#e52e06" />
                                                </div>
                                                <div className='content'>
                                                    <h6>{t('Say hello')}</h6>
                                                    <Link href='{set.email}' className='hover-red text-2xl md:text-4xl'>{set.email}</Link>
                                                </div>
                                        </div>         
                                        <div className='info-item flex gap-3'>
                                                <div className='icon'>
                                                    <UilMap  size="45" color="#e52e06" />
                                                </div>
                                                <div className='content'>
                                                    <h6>{t('Address')}</h6>
                                                    <p className=''>{set.address}</p>
                                                </div>
                                        </div>         
                                    </div>
                                )
                            })
                        }
                        
                </div>
            </div>
          </div>

            {/* Clients' Opinions */}
            {/* <div className='custom-container mx-auto'>
              <div className='py-16'>
                <div className='mb-9'>
                    <h1 className='text-center md:text-left text-xl md:text-4xl font-bold mb-3'>{t('We love our clients')}</h1>
                    <p className='text-center md:text-left '>{t('People love our products and our customers too. We believe it!')}</p>
                </div>

                <div className='opinions-grid grid grid-cols-1 lg:grid-cols-3 gap-8'>
                    {
                        testimonials.map(testi=>{
                            return(
                                <div className='item relative' key={testi.id}>
                                    <div className='item-header'>
                                        <h5>{testi.title}</h5>
                                    </div>
                                    <div className='item-main'>
                                        <p>{testi.description}</p>
                                    </div>
                                    <div className='item-bottom'>
                                        <h6>{testi.fullname}</h6>
                                        <p>/ {testi.position}, {testi.country}</p>
                                    </div>
                                    <div className='bg-icon'>
                                        <Image src={BgIcon} width={300} height={400} className='' alt='Icon'/>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>

              </div>
            </div> */}
        </section>

    </main>
  )
}

export default About;
