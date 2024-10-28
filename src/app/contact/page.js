'use client'
import React, { useState ,useEffect } from 'react'
import { useTranslation } from 'react-i18next';
import '../../i18n'
import { UilLocationPoint, UilPhone, UilClock } from '@iconscout/react-unicons'
import { API_URL } from '@/constants';

export default function Contact() {
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
  if (typeof localStorage !== 'undefined') {
    if(localStorage.getItem("langId")!=null){
      lang_id=localStorage.getItem("langId");
    }
    
}
  const params = new URLSearchParams();
  params.append('LanguageID',lang_id);
  const response = await fetch(
    `${API_URL}/api/about/get-index?${params.toString()}`
  );
  const data = await response.json();
  return data.output;
}
  
  const [data, setData] = useState({ 
    settings: []
  });
  useEffect(() => {
        
    async function fetchDataAsync() {
      
      const fetchedData = await fetchData();
          setData(fetchedData);
          await i18n.changeLanguage(lang_id);
      }

    fetchDataAsync();
  }, []);
  const settings = data.settings;

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
  return (
    <main>

        {/* Breadcrumb */}
        <div className='breadcrumb-wrapper py-8'>
          <div className='custom-container mx-auto'>
            <div className="flex" aria-label="Breadcrumb">
              <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">

                <li className="inline-flex items-center">
                  <a href="/" className="inline-flex items-center text-sm font-medium text-gray-700 dark:text-gray-400">{t('Home')}</a>
                </li>

                <li>
                  <div className="flex items-center">
                    <a href="#" className="ms-1 text-sm font-medium text-gray-700  md:ms-2 dark:text-gray-400">{t('Contact')}</a>
                  </div>
                </li>

              </ol>
            </div>
          </div>
        </div>
        
        {/* Contact  Section Info */}
        <section className='contact-info-section mt-5'>
          <div className='custom-container mx-auto'>
            <div>
              <h1 className='text-center md:text-left text-xl md:text-4xl font-bold'>{t('We are always eager to hear from you!')}</h1>
              <p className='text-center md:text-left '>{t('You can call us in working time. All mails will get the response within 24 hours.')}</p>
              {
                settings.map(set=>{
                  const hours = set.workTimes.split(',')
                  console.log(hours)
                  const hours_div=[]
                  hours.map(hour=>{
                    hours_div.push(<li>{hour}</li>)
                  })
                  return(
                    <div className="grid grid-cols-1 lg:grid-cols-3 mt-11 gap-2">
                      <div className="flex mb-3 lg:mb-0">
                        <div className='icon mr-5'>
                          <UilLocationPoint size="40" color="#e55022"/> 
                        </div>
                        <div className='content'>
                            <h3 className='mb-3 lg:mb-5'>{t('Address')}</h3>
                            
                            <ul>
                              <li>{set.address}</li>
                            </ul>
                        </div>
                      </div>
                      <div className="flex mb-3 lg:mb-0">
                        <div className='icon mr-5'>
                        <UilPhone size="40" color="#e55022"/> 
                        </div>
                        <div className='content'>
                            <h3 className='mb-3 lg:mb-5'>{t('Contact')}</h3>

                            <ul>
                              <li>{t('Mobile')}: <b>{set.phone}</b></li>
                              <li>{t('Whatsapp')}: <b>{set.whatsappNo}</b></li>
                              <li>{t('Email')}: <b>{set.email}</b></li>
                            </ul>
                        </div>
                      </div>
                      <div className="flex mb-3 lg:mb-0">
                        <div className='icon mr-5'>
                          <UilClock size="40" color="#e55022"/> 
                        </div>
                        <div className='content'>
                            <h3 className='mb-3 lg:mb-5'>{t('We are open')}:</h3>
                            <ul>
                              {hours_div}
                            </ul>
                        </div>
                      </div>
                    </div>
                  )
                })
                

              }
              
            </div>
          </div>
        </section>


        {/* Contact  Section Map */}
        <section className='contact-map-section'>
            <div className='custom-container mx-auto'>
            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3037.254381998995!2d49.83735287625743!3d40.42536577143825!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x403087de49657781%3A0x43bcfacd8ab4c29a!2s15%20S%C3%BCleyman%20Sani%20Axundov%2C%20Bak%C4%B1%2C%20Azerbaijan!5e0!3m2!1sen!2str!4v1713532662526!5m2!1sen!2str" width="600" height="450" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
            </div>
        </section>


        {/* Contact  Section Form */}
        <section className='contact-form-section'>
          <div className='custom-container mx-auto'>

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
        </section>

    </main>
  )
}

