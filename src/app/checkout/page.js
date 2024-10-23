'use client'
import {React, useEffect, useState} from 'react';
import { useTranslation } from 'react-i18next';
import '../../i18n'
import Image from 'next/image';
import Link from 'next/link';
import { UilLocationPoint, UilPhone, UilClock } from '@iconscout/react-unicons'
import Map from './map/page'


async function fetchData(){
    const response = await fetch("http://89.40.2.200:3461/api/home/get-dillers-list");
    const data = await response.json();
    return data.output;
}


export default function Order() {
  const { t, i18n } = useTranslation();
    const [data, setData] = useState({ 
                                    dillers: []
                                    });
    
    useEffect(() => {
        
      async function fetchDataAsync() {
        
        const fetchedData = await fetchData();
            setData(fetchedData);
        }
  
      fetchDataAsync();
    }, []);
      
    const dillers = data.dillers; 

   
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
                    <a href="#" className="ms-1 text-sm font-medium text-gray-700  md:ms-2 dark:text-gray-400">{t('Diller List')}</a>
                  </div>
                </li>

              </ol>
            </div>
          </div>
        </div>
        
        {/* Order  Section Info */}
        <section className='order-info-section mt-5'>
          <div className='frd-container mx-auto'>
            <div>
              <h1 className='text-center md:text-left text-xl md:text-4xl w-3/5 mb-8'>{t('Choose the address of the nearest Diller and order the products.')}</h1>
              <h2 className='mb-8'>{t('Please check the availability of the product to order from the Diller.')} </h2>
              <div className="order-page-grid flex gap-16">
                    {/* Version 1 */}
                    <div className="w-2/5">
                        {
                            dillers.map(diller=>{
                                return(
                                <div className="w-full overflow-hidden bg-white rounded-lg shadow-lg mb-16">
                                    {/* <Image src={Img1} width={500} height={300} className='object-cover object-center w-full h-56' alt='Product'/> */}
                                    
                                    <div className="px-6 py-4">
                                        <h1 className="text-xl font-semibold text-gray-800">{diller.firstName} {diller.lastName}</h1>
                                        <Link href={diller.phone} className="pt-2 text-gray-700 block">{diller.phone}</Link>
                                        <p className="py-2 text-gray-700 ">{diller.address}</p>
                                    </div>
                                </div>
                                )
                            })
                        }
                        
                            
                    </div>

                    {/* Version 2 */}
                    {/* <div className="w-2/5">
                        
                    </div> */}

                    
                    <section className='contact-map-section'>
                      <div className='custom-container mx-auto'>
                        <Map width={200}/>
                      </div>
                  </section>
                    
              </div>              
            </div>
          </div>
        </section>

    </main>
  )
}

