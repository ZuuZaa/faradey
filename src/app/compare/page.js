'use client'
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import '../../i18n';
import Link from 'next/link';
import Image from 'next/image';
import {UilMultiply } from '@iconscout/react-unicons'
import { useRouter } from 'next/navigation';





export default function Compare() {
  const { t, i18n } = useTranslation();
  const router = useRouter();

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
    let token="";
    let session_id="";
    
    if (typeof localStorage !== 'undefined') {
        token = localStorage.getItem("jwtToken");
        session_id=localStorage.getItem("sessionId");
        if(localStorage.getItem("langId")!=null){
          lang_id=localStorage.getItem("langId");
        }
    }
    const params = new URLSearchParams();
    params.append('SessionId', session_id);
    params.append('LanguageID',lang_id);
      const response = await fetch(`http://89.40.2.200:3461/api/compare/get-index?${params.toString()}`,{
        method: "GET",
        headers: {
          'Accept': 'application/json, text/plain',
          'Content-Type': 'application/json;charset=UTF-8',
          'Authorization': 'Bearer ' + token
        },
  });
      const data = await response.json();
      return data.output;
  }
  const [data, setData] = useState({ 
                                    compareProducts: []
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
      const langBtns = document.getElementsByClassName('lang_btn');
  
      for (let i = 0; i < langBtns.length; i++) {
        langBtns[i].addEventListener('click', changeLanguage);
      }
  
      return () => {
        for (let i = 0; i < langBtns.length; i++) {
          langBtns[i].removeEventListener('click', changeLanguage);
        }
      };
    }, []);
    const compareProducts = data.compareProducts ;
    const datass = compareProducts.map(x => x.productDescription);
    console.log(datass); // Məhsulun HTML mətnini yoxlayırıq
    
    const htmlString = datass.reduce((acc, description, index) => {
      acc[`product${index + 1}`] = description;
      return acc;
    }, {});
    
    const regex = /<p[^>]*>.*?<\/p>/g;
    
    const productsArray = [];
    
    const parsedProducts = {};
    for (let product in htmlString) {
      let productHtml = htmlString[product];
      const productArray = [];
      let match;
      while ((match = regex.exec(productHtml)) !== null) {
        productArray.push(match[0].trim());
      }
      parsedProducts[product] = productArray;
      regex.lastIndex = 0; 
    }
    
    
    const maxLength = Math.max(...Object.values(parsedProducts).map(arr => arr.length));
    
    for (let i = 0; i < maxLength; i++) {
      let obj = {};
      for (let product in parsedProducts) {
        obj[product] = parsedProducts[product][i] || ""; 
      }
      productsArray.push(obj);
    }
    
 
    
    let removeCompare = async (event) => {
      let prodid = event.currentTarget.getAttribute('id');
      let token = "";
      let session_id = "";
    
      if (typeof localStorage !== 'undefined') {
        token = localStorage.getItem("jwtToken");
        session_id = localStorage.getItem("sessionId");
      }
    
      try {
        const res = await fetch("http://89.40.2.200:3461/api/compare/remove-compare", {
          method: "POST",
          headers: {
            'Accept': 'application/json, text/plain',
            'Content-Type': 'application/json;charset=UTF-8',
            'Authorization': 'Bearer ' + token
          },
          body: JSON.stringify({
            ProductId: prodid,
            SessionId: session_id
          }),
        });
    
        if (res.status === 200) {
          const resJson = await res.json();
    
      if (compareProducts.length>1) {
        const updatedData = await fetchData(); 
        setData(updatedData); 
      }else{
        router.push("/")
      }
        
    
          // Eğer ürün kalmadıysa, uyarı mesajını göster
          if (updatedData.compareProducts.length === 0) {
            document.getElementById("compare_table").innerHTML = "<p>There is no product for comparing!</p>";
          }
        }
      } catch (err) {
        
      }
      
    }
    

    
      
    
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
                    <span className="ms-1 text-sm font-medium md:ms-2">{t('Compare Products')}</span>
                  </div>
                </li>

              </ol>
            </div>
          </div>
        </div>
        
        {/* Compare Product Section */}
        <section className='compare-main-section mt-5 pt-16'>
            <div className='frd-container mx-auto'>
                {/* Compare Products */}
                <div className='compare-wrapper mt-11 mb-20'>
                    <div className='compare-page-table' id="compare_table">
                      {
                        compareProducts.length>0?(
                          <table style={{
                            marginTop: "20px",
                            borderCollapse: 'collapse',
                            ...(compareProducts.length > 3 ? { width: "100%" } : {})
                          }}>
                            <tbody>
                              <tr>
                                <th style={{ border: '1px solid #ebebeb', padding: '8px', width: '10%', textAlign: "start" }}>Action</th>
                                {compareProducts.map((product, index) => (
                                  <td key={product.productId} style={{ border: '1px solid #ebebeb', padding: '8px', width: '10%', textAlign: "center" }}>
                                    <span className='remove-compare-item-span hover-red-bg' onClick={removeCompare} id={product.productId}>
                                      <UilMultiply size="12" color="#ffffff" />
                                    </span>
                                  </td>
                                ))}
                              </tr>
                              <tr>
                                <th style={{ border: '1px solid #ebebeb', padding: '8px', width: '20%', textAlign: "start" }}>Product name</th>
                                {compareProducts.map(product => (
                                  <td key={product.productId} style={{ border: '1px solid #ebebeb', padding: '8px', width: '20%', textAlign: "center" }}>
                                    {product.productName}
                                  </td>
                                ))}
                              </tr>
                              <tr>
                                <th style={{ border: '1px solid #ebebeb', padding: '8px', width: '20%', textAlign: "start" }}>Product image</th>
                                {compareProducts.map(product => (
                                  <td key={product.productId} style={{ border: '1px solid #ebebeb', padding: '8px', width: '20%', textAlign: "center" }}>
                             <div className='flex flex-col'>
                                                                              <img src={product.productImage} width={150} height={150} className='blog-swiper-item-img object-cover mx-auto' alt='Product'></img>
                                                                              {/* <Image src={PImg1} width={150} height={150} className='blog-swiper-item-img object-cover mx-auto' alt='Blog'/> */}
                                                                              <h5 className='text-red-600 font-semibold my-3'>On Sale <span className='font-medium ml-1'>{product.productPrice.toFixed(2)}₼</span></h5>
                                                                              <Link href={"/details/" + product.productId} key={product.id} passHref={true} className='hover-red'>{t('View product')}</Link>
                                                                          </div>
                                  </td>
                                ))}
                              </tr>
                              <tr>
                                <th style={{ border: '1px solid #ebebeb', padding: '8px', width: '20%', textAlign: "start" }}>Product about</th>
                                {compareProducts.map(product => (
                                  <td key={product.productId} style={{ border: '1px solid #ebebeb', padding: '8px', width: '20%', textAlign: "start" }}>
                                    {product.productAbout}
                                  </td>
                                ))}
                              </tr>
                              <tr>
                            <th style={{ border: '1px solid #ebebeb', padding: '8px', width: '20%', textAlign: "start" }}>Product description</th>
                            <td colSpan={4}>
                              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <tbody>
                                {
                                productsArray.map((x,i)=>(
                                    <tr key={i}>
                                   {x.product1?<td style={{ border: '1px solid #ebebeb',width:"25%" ,padding: '8px' }}><div dangerouslySetInnerHTML={{ __html:x.product1 }} /></td>:""} 
                                   {x.product2?<td style={{ border: '1px solid #ebebeb',width:"25%" ,padding: '8px' }}><div dangerouslySetInnerHTML={{ __html:x.product2 }} /></td>:""} 
                                   {x.product3?<td style={{ border: '1px solid #ebebeb',width:"25%" ,padding: '8px' }}><div dangerouslySetInnerHTML={{ __html:x.product3 }} /></td>:""} 
                                   {x.product4?<td style={{ border: '1px solid #ebebeb',width:"25%" ,padding: '8px' }}><div dangerouslySetInnerHTML={{ __html:x.product4 }} /></td>:""} 
                          
                                  </tr>
                                  ))
                                }
                               
                                  
                                 
                                </tbody>
                              </table>
                            </td>
                          </tr>
                          
                          
                              
                            </tbody>
                          </table>
                        ):(<p>{t('There is no product for comparing!')}</p>)
                      }
                       
      

                    </div>
                </div>
            </div>
        </section>

    </main>
  )
}

