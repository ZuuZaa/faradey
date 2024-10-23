'use client'
import {React, useEffect, useState} from 'react';
import { useTranslation } from 'react-i18next';
import '../../../../i18n';
import Link from 'next/link';
import Image from 'next/image';
import { UilTrashAlt, UilTable, UilHeart, UilComparison, UilStar, UilInfo } from '@iconscout/react-unicons'
import { UisListUl } from '@iconscout/react-unicons-solid'
import { Accordion, AccordionHeader, AccordionBody } from "@material-tailwind/react";

import PaginationButtons from '../../../../components/pagination/PaginationButtons';



function Icon({ id, open }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      className={`${id === open ? "rotate-180" : ""} h-5 w-5 transition-transform`}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
    </svg>
  );
}



export default function AddProject() {
  var id  = 1;
  const { t, i18n } = useTranslation();

    const changeLanguage = async (event) => {
        const lng=event.currentTarget.textContent
        await i18n.changeLanguage(lng);
        if(typeof localStorage !== 'undefined') {
            localStorage.setItem("langId",lng)
        }
        const fetchedData = await mainFunc();
        setData(fetchedData);

    };

    let lang_id='EN';
    
    
    const mainFunc=async () => {
      let status;
      let fav_data=[];

      const fetchData = async () => {
    
    
      let token="";
      if (typeof localStorage !== 'undefined') {
          token = localStorage.getItem("jwtToken");
          if(localStorage.getItem("langId")!=null){
            lang_id=localStorage.getItem("langId");
          }
      }
      var params = new URLSearchParams();
      params.append('Id',id)
      params.append('LanguageID',lang_id);
      console.log("salamm",params.toString());
      let response=await fetch(`http://89.40.2.200:3461/api/projects/get-add-project?${params.toString()}`,{
          method: 'GET',
          dataType: 'json',
          headers: {
              'Accept': 'application/json, text/plain',
              'Content-Type': 'application/json;charset=UTF-8',
              'Authorization': 'Bearer ' + token
          },
      }
      )
       const resp = await response.json();
       status=resp.status
       fav_data=resp.output
      //  let all_prods=document.getElementById("addp-main-table2").getElementsByTagName("tr")
      //  let added_prods=document.getElementsByClassName("addp-projects-add-btn")
      //   for (let i = 0; i < added_prods.length; i++) {
      //       added_prods[i].disabled=false;
      //       added_prods[i].classList.remove("added")
      //   }
        //.classList.add("added")
       //return resp.output;
  }

  await fetchData()

  if (status === 401) {
      try {
          let token="";
          let refreshToken="";
          if (typeof localStorage !== 'undefined') {
              token = localStorage.getItem("jwtToken");
              refreshToken=localStorage.getItem("refreshToken");
          }
          let response=await fetch(`http://89.40.2.200:3461/api/account/refresh-token?userRefreshToken=${refreshToken}`,{
              method: 'POST',
              dataType: 'json',
              headers: {
                  'Accept': 'application/json, text/plain',
                  'Content-Type': 'application/json;charset=UTF-8',
                  'Authorization': 'Bearer ' + token
              },
          })
          console.log(response)
          const resp = await response.json();
          
          if(resp.status !== 400) {
              if (typeof localStorage !== 'undefined') {
                  localStorage.setItem("refreshToken", resp.output.refreshToken);
                  localStorage.setItem("jwtToken", resp.output.token);
              }
              

              await fetchData();
          } else {
              
              if (typeof window !== 'undefined') {
                  window.location.href="/login"
                }
              //go to login page
              //alert(1)
          }
      } 
      catch {
          console.log("error")
      }
  }
  else{
      return fav_data
  }
  
}
  const [open, setOpen] = useState(0);
  const [bull, setBull] = useState(false);

 
  const handleOpen = (value) => setOpen(open === value ? 0 : value);

  const [data, setData] = useState({ 
                            products: [], 
                            categoryName: [], 
                            attributeNames: [], 
                            attributeValues: [],
                            mainCategories:[],
                            subCategories:[],
                            projects: [],
                            contractors:[],
                            searchProducts:[]
        }); 
        
    useEffect(() => {
        async function fetchDataAsync() {
        const fetchedData = await mainFunc();
        setData(fetchedData);
        await i18n.changeLanguage(lang_id);
    }
    setBull(!bull)
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

    // useEffect(() => {
      
    //   let all_prods=document.getElementById("addp-main-table2").getElementsByClassName("addp-projects-add-btn")
    //   let added_prods=document.getElementById("added_products").getElementsByTagName("tr")
    //   //console.log(all_prods)
    //   //console.log(added_prods)
    //   for (let i = 0; i < added_prods.length; i++) {
    //     //console.log(added_prods[i].getAttribute('id'))
    //     for(let j = 0; j < all_prods.length; j++){
    //       console.log(added_prods[i].getAttribute('id')+"  "+all_prods[j].getAttribute('id'))
    //       if(added_prods[i].getAttribute('id')==all_prods[j].getAttribute('id')){
          
    //         all_prods[j].disabled=true;
    //         all_prods[j].classList.add("added")
    //       }
    //       else{
    //         all_prods[j].disabled=false;
    //         all_prods[j].classList.remove("added")
    //       }
    //     }
        
        
    //   }
      
    // }, []);

    

      
    const products = data.products;

    useEffect(() => {
      const da = document.getElementsByClassName("addp-projects-add-btn");
    
      // Sınıfları kaldırıyoruz
      for (let i = da.length - 1; i >= 0; i--) {
        da[i].classList.remove("added");
      }
      
      // Bu useEffect sadece products değiştiğinde çalışacak
    }, [products]);
    const attributeNames=data.attributeNames;
    const attributeValues=data.attributeValues;
    const mainCategories=data.mainCategories;
    const subCategories=data.subCategories;
    const contractors=data.contractors;

    let append_element=``;
    let addProduct = (e) => {
      let prod_id=e.currentTarget.getAttribute('id')
      let quantity=1
      let product_name=e.currentTarget.parentElement.parentElement.getElementsByClassName("prod_name")[0].innerText
      let price=e.currentTarget.parentElement.parentElement.getElementsByClassName("prod_price")[0].innerText.split('₼')[0]
      let wholesale=e.currentTarget.parentElement.parentElement.getElementsByClassName("prod_wholesale")[0].innerText.split('₼')[0]
      let diller=e.currentTarget.parentElement.parentElement.getElementsByClassName("prod_diller")[0].innerText.split('₼')[0]
      let unit=e.currentTarget.parentElement.parentElement.getElementsByClassName("prod_unit")[0].innerText
      let all_prods=document.getElementById("addp-main-table2").getElementsByClassName("addp-projects-add-btn")
      // // for (let i = 0; i < all_prods.length; i++) {
      // //   if(all_prods[i].getAttribute('id')==prod_id){
          
      // //     all_prods[i].disabled=true;
      // //     all_prods[i].classList.add("added")
      // //   }
        
      // // }currentTarget
       e.disabled=true
       e.currentTarget.classList.add("added")
      
      append_element=`<tr class='border-b border-gray-200' id=${prod_id}>
          <td class="font-medium text-black hover:text-gray-700 transition ease-in">${product_name}</td>
          <td class="font-medium text-black hover:text-gray-700 transition duration-1">
              <input type='number' id="quant" class='outline-none w-16 border border-gray-200 text-center py-2 rounded-md my-2' min='1' value=${quantity} />
          </td>
          <td class="font-medium text-black hover:text-gray-700 transition duration-1">Ədəd</td>
          <td class="font-medium text-black hover:text-gray-700 transition duration-1">${price}₼</td>
          <td class="font-medium text-black hover:text-gray-700 transition duration-1">${wholesale}₼</td>
          <td class="font-medium text-black hover:text-gray-700 transition duration-1">${diller}₼</td>
          <td class="font-medium text-black hover:text-gray-700 transition duration-1">
              <button class='addp-projects-remove-btn rounded-full font-bold inline-block text-base'>x</button>
          </td>
    </tr>`
    document.getElementById("added_products").insertAdjacentHTML('beforeend',append_element);
    var remove_proj_btns=document.getElementsByClassName("addp-projects-remove-btn")
    for (let i = 0; i < remove_proj_btns.length; i++) 
          {
            remove_proj_btns[i].addEventListener('click',removeProduct)
          }
    }
    let removeProduct = (e) => {
      let prod_id=e.currentTarget.parentElement.parentElement.getAttribute('id')
      let prod_tr=e.currentTarget.parentElement.parentElement
      prod_tr.remove()
      let added_prods=document.getElementsByClassName("addp-projects-add-btn")
      // for (let i = 0; i < added_prods.length; i++) {
      //   if(added_prods[i].getAttribute('id')==prod_id){
          
      //     added_prods[i].disabled=false;
      //     added_prods[i].classList.remove("added")
      //   }
      // }
      //append_element="";
    }

    let clearProducts=(e)=>{
      document.getElementById("added_products").innerHTML=""
      // let added_prods=document.getElementsByClassName("addp-projects-add-btn")
      // for (let i = 0; i < added_prods.length; i++) {
      //     added_prods[i].disabled=false;
      //     added_prods[i].classList.remove("added")
      // }
    }
    const [name, setName] = useState("");
    const [message, setMessage] = useState("");

    

    let saveProject=async (e)=>{
      let arrayOfObjects = [];

    const table = document.getElementById('addp-main-table1');
    const rows = table.getElementsByTagName('tbody')[0].getElementsByTagName('tr');
    for (let i = 0; i < rows.length; i++) {
      const cells = rows[i].getElementsByTagName('td');
      const rowData = {
        Id:rows[i].getAttribute('id'),
        UnitOfMeasure:1, 
        Quantity: parseInt(cells[1].firstElementChild.value),
        Price:parseFloat(cells[3].innerText.split('₼')[0]),
        WholesalePrice:parseFloat(cells[4].innerText.split('₼')[0]),
        DillerPrice:parseFloat(cells[5].innerText.split('₼')[0]),

      };
      
      arrayOfObjects.push(rowData);
    }
        let token="";
        let refreshToken="";
        if (typeof localStorage !== 'undefined') {
            token = localStorage.getItem("jwtToken");
            refreshToken=localStorage.getItem("refreshToken");
        }
        const formData = new FormData();
        formData.append("ProjectId",0)
        formData.append("Name",name)
        formData.append("Products",JSON.stringify(arrayOfObjects))
        formData.append("Status",1)
        formData.append("Kind",1)
        console.log(formData)
      try {
        const res = await fetch("http://89.40.2.200:3461/api/projects/post-project", {
          method: "POST",
          headers: {
            'Authorization': 'Bearer ' + token
          },
          body: formData
        });
        const resJson = await res.json();
        if (res.status === 200) {
          
          setMessage(t('Project saved successfully'));
          window.location.href="/account/projects"
        } else {
          setMessage(t('Some error occured'));
        }
      } catch (err) {
        console.log(err);
      }
    }

    const [myArray, setMyArray] = useState([]);
    var newArray = [...myArray];
    let addFilter=(e)=>{
      let val=e.currentTarget.value
      let index=newArray.indexOf(val)
      console.log(index)
      if(index==-1){
        newArray.push(val);
        setMyArray(newArray)
      }
      else{
        console.log("remove")
        newArray.splice(index, 1)
        setMyArray(newArray)
      }

    }
    const [myArray1, setMyArray1] = useState([]);
    var newArray1 = [...myArray1];
    let addFilterContra=(e)=>{
      let val=e.currentTarget.value
      console.log(val)
      let index=newArray1.indexOf(val)
      if(index==-1){
        newArray1.push(val);
        setMyArray1(newArray1)
      }
      else{
        newArray1.splice(index, 1)
        setMyArray1(newArray1)
      }

    }
    let productFiltering=async()=>{
      if (typeof localStorage !== 'undefined') {
        if(localStorage.getItem("langId")!=null){
          lang_id=localStorage.getItem("langId");
        }
    }
    var params = new URLSearchParams();
    params.append('LanguageID',lang_id);
      const token = localStorage.getItem("jwtToken");
      const session_id=localStorage.getItem("sessionId");
      const min_price=parseFloat(document.getElementById("min_price").value)
      const max_price=parseFloat(document.getElementById("max_price").value)
      try{
        const res = await fetch(`http://89.40.2.200:3461/api/projects/get-add-project-filter`, {
            method: "POST",
            headers: {
              'Accept': 'application/json, text/plain',
              'Content-Type': 'application/json;charset=UTF-8',
              'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({
              Id: id,
              AttrArrays:newArray,
              SessionId:session_id,
              MinPrice:min_price,
              MaxPrice:max_price,
              Contras:newArray1,
              LanguageID:lang_id
    
            }),
          });
          console.log(res)
          const resJson = await res.json();
          setData(resJson.output);
          setBull(!bull)
          //products=resJson.output.products
          //console.log(resJson)
    
      }
      catch(err)
      {
        console.log(err);
      }
    }
    let searchProds=async(event)=>{
      if (event.key === 'Enter') {
      const searchWord=event.currentTarget.value;
      console.log(searchWord)
      if (typeof localStorage !== 'undefined') {
        if(localStorage.getItem("langId")!=null){
          lang_id=localStorage.getItem("langId");
        }
    }
    //var params = new URLSearchParams();
    //params.append('LanguageID',lang_id);
      const token = localStorage.getItem("jwtToken");
      const session_id=localStorage.getItem("sessionId");
      const min_price=parseFloat(document.getElementById("min_price").value)
      const max_price=parseFloat(document.getElementById("max_price").value)
      try{
        const res = await fetch(`http://89.40.2.200:3461/api/projects/get-add-project-search`, {
            method: "POST",
            headers: {
              'Accept': 'application/json, text/plain',
              'Content-Type': 'application/json;charset=UTF-8',
              'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({
              Id: id,
              AttrArrays:newArray,
              SessionId:session_id,
              //MinPrice:min_price,
              //MaxPrice:max_price,
              Contras:newArray1,
              Search:searchWord,
              LanguageID:lang_id
    
            }),
          });
          
          const resJson = await res.json();
          console.log(resJson)
          setData(resJson.output);
          setBull(!bull)
          // products=resJson.output.searchProducts;
          // console.log(products)
          //products=resJson.output.products
          
    
      }
      catch(err)
      {
        console.log(err);
      }
    }
    }
    let categoryFilter=async(e)=>{
      
      id=e.currentTarget.getAttribute('id')
      //params.set('Id',id)
      const fetchedData = await mainFunc();
      setData(fetchedData);
      setBull(!bull)
    
    }
    
  return (
    
    <main>

        {/* Breadcrumb */}
        <div className='breadcrumb-wrapper py-8'>
          <div className='custom-container mx-auto'>
            <div className="flex" aria-label="Breadcrumb">
              <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
                <li className="inline-flex items-center">
                   <a href="/account" className="inline-flex items-center text-sm font-medium">{t('My Account')} </a>
                </li>
                <li>
                  <div className="flex items-center">
                      <a href="#" className="ms-1 text-sm font-medium md:ms-2">{t('Add Project')} </a>
                  </div>
                </li>
              </ol>
            </div>
          </div>
        </div>
        
        {/* Add Project Section */}
        <section className='add-project-section mt-5 pt-16'>
          <div className='frd-container mx-auto'>
                <div className='add-project-grid block xl:flex mb-52'>
                    <div className='category-filters w-full xl:w-1/4 px-4 xl:pr-8'>
                          {
                                mainCategories.map(cat=>{
                                  return(
                                    <div>
                                      <h3 className='hover-red mt-6 text-lg font-semibold capitalize' onClick={categoryFilter} id={cat.id}>{cat.name}</h3>
                                      <div className='pl-6'>
                                        {
                                          subCategories.filter(c=>c.mainId==cat.id).map(subcat=>{
                                            return(<h6 className='hover-red mt-2 font-medium hover:underline capitalize' onClick={categoryFilter} id={subcat.id}>{subcat.name}</h6>)
                                          })
                                        }
                                        
                                      </div>
                                    </div>
                                    )
                                  
                                  
                                })
                              }


                          {/* Clear All */}
                          {/* <button className='cf-clear-all-btn mt-6 hover-red-bg flex justify-center gap-2 w-full font-bold text-base'><UilTrashAlt size='22' color='#333'/> CLEAR ALL</button> */}
                          <Accordion open={open === 98} className='mt-6 p-4' icon={<Icon id={98} open={open} />}>
                            <AccordionHeader onClick={() => handleOpen(98)} className='font-medium'>
                                  {t('Manufacturer')}
                            </AccordionHeader>
                            <AccordionBody>
                                  {/* <div className='flex justify-between mb-4'>
                                     <span className='cf-selected-span'>0 selected</span>
                                     <span className='border-dotted border-b border-b-stone-600 cursor-pointer hover-red'>Reset</span>
                                  </div> */}
                                  <div className='category-filters-boxes'>
                                    {
                                      contractors.map(contra=>{
                                        return(<div className="flex items-center gap-1">
                                        <label class="relative flex items-center p-2 rounded-full cursor-pointer" htmlFor="blue">
                                          <input type="checkbox"
                                            class="before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-md border border-blue-gray-200 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-blue-500 checked:bg-blue-500 checked:before:bg-blue-500 hover:before:opacity-10"
                                            id="blue" onChange={addFilterContra} value={contra.idn} />
                                          <span
                                            class="absolute text-white transition-opacity opacity-0 pointer-events-none top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 peer-checked:opacity-100">
                                            <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor"
                                              stroke="currentColor" stroke-width="1">
                                              <path fill-rule="evenodd"
                                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                clip-rule="evenodd"></path>
                                            </svg>
                                          </span>
                                        </label>
                                        <label for='blue'>{contra.name}</label>
                                      </div>)

                                      })
                                    }
                                    
                                  </div>
                            </AccordionBody>
                          </Accordion>
                          {
                            attributeNames.map(attrname=>{
                              return(
                          <Accordion open={open === attrname.id} className='mt-6 p-4' icon={<Icon id={attrname.id} open={open} />}>
                            <AccordionHeader onClick={() => handleOpen(attrname.id)} className='font-medium'>
                                  {attrname.attrName}
                            </AccordionHeader>
                            <AccordionBody>
                                  {/* <div className='flex justify-between mb-4'>
                                     <span className='cf-selected-span'>0 selected</span>
                                     <span className='border-dotted border-b border-b-stone-600 cursor-pointer hover-red'>Reset</span>
                                  </div> */}
                                  <div className='category-filters-boxes'>
                                    {
                                      attributeValues.filter(v=>v.nameId==attrname.id).map(value=>{
                                        return(<div className="flex items-center gap-1">
                                        <label class="relative flex items-center p-2 rounded-full cursor-pointer" htmlFor="blue">
                                          <input type="checkbox"
                                            class="before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-md border border-blue-gray-200 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-blue-500 checked:bg-blue-500 checked:before:bg-blue-500 hover:before:opacity-10"
                                            id="blue" onChange={addFilter} value={value.valueId} />
                                          <span
                                            class="absolute text-white transition-opacity opacity-0 pointer-events-none top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 peer-checked:opacity-100">
                                            <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor"
                                              stroke="currentColor" stroke-width="1">
                                              <path fill-rule="evenodd"
                                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                clip-rule="evenodd"></path>
                                            </svg>
                                          </span>
                                        </label>
                                        <label for='blue'>{value.valueName}</label>
                                      </div>)

                                      })
                                    }
                                    
                                  </div>
                            </AccordionBody>
                          </Accordion>
                              )
                            })
                          }
                          
                          

                          {/* Price Slider */}
                          <Accordion open={open === 4} className='mt-6 p-4' icon={<Icon id={4} open={open} />}>
                            <AccordionHeader onClick={() => handleOpen(4)} className='font-medium'>
                            {t('Price Slider')}
                            </AccordionHeader>
                            <AccordionBody>
                                  <div className='flex justify-between mb-4'>
                                     <span className='cf-selected-span'>{t('selected')}</span>
                                     <span className='border-dotted border-b border-b-stone-600 cursor-pointer hover-red'>{t('Reset')}</span>
                                  </div>
                                  <div className='category-filters-boxes-price flex items-center gap-2'>
                                    <input type='number' placeholder='0' min='0' id="min_price" defaultValue="0"/>
                                    -
                                    <input type='number' placeholder='0' id="max_price" defaultValue="0"/>
                                  </div>
                            </AccordionBody>
                          </Accordion>
                          <button className='cf-clear-all-btn hover-red-bg flex justify-center gap-2 w-full font-bold text-base mt-6' onClick={productFiltering}> {t('APPLY')}</button>
                    </div>        
                    <div className='w-full xl:w-3/4 px-4'>
                    <div className="message">{message ? <p>{message}</p> : null}</div>
                        <div className='px-2 py-3 mb-2 bg-gray-800 text-white flex justify-between items-center addp-main-top-wrap'>
                            <div className='text-center'>
                                {/* <h2 className='text-xl mb-2'>Logix Layihə</h2> */}
                                <input type='text' placeholder='Project Name' className='border border-gray-200 w-full px-3 py-1 outline-none text-black' onChange={(e) => setName(e.target.value)}/>
                            </div>
                            {/* <div>
                                <button className='py-1 px-3 rounded-md link-design1'>Delete Project</button>
                            </div> */}
                        </div>

                        <div className='addp-main-products'>

                            {/* Title */}
                            <div className='px-2 py-3 mb-2 bg-gray-800 text-white'>
                                <h4 className='text-xl'> {t('Added Products')} </h4>
                            </div>


                            {/* Table */}
                            <table id='addp-main-table1' className="text-center min-w-full divide-y divide-gray-200 mt-2 mb-2">
                                <thead class="bg-gray-50">
                                <tr>
                                    <th scope="col" class="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">{t('Product name')}</th>
                                    <th scope="col" class="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">{t('Quantity')}</th>
                                    <th scope="col" class="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">{t('Unit of Measure')}</th>
                                    <th scope="col" class="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">{t('Price')}</th>
                                    <th scope="col" class="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">{t('Wholesale Price')}</th>
                                    <th scope="col" class="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">{t('Diller Price')}</th>
                                    <th scope="col" class="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">{t('Remove')}</th>
                                </tr>
                                </thead>
                                <tbody id="added_products">
                                    {/* <tr className='border-b border-gray-200'>
                                            <td class="font-medium text-black hover:text-gray-700 transition ease-in">Camera V231SA 2023</td>
                                            <td class="font-medium text-black hover:text-gray-700 transition duration-1">
                                                <input type='number' className='outline-none w-16 border border-gray-200 text-center py-2 rounded-md my-2' min='1'/>
                                            </td>
                                            <td class="font-medium text-black hover:text-gray-700 transition duration-1">Ədəd</td>
                                            <td class="font-medium text-black hover:text-gray-700 transition duration-1">112$</td>
                                            <td class="font-medium text-black hover:text-gray-700 transition duration-1">224$</td>
                                            <td class="font-medium text-black hover:text-gray-700 transition duration-1">
                                                <button className='addp-projects-remove-btn rounded-full font-bold inline-block text-base'>x</button>
                                            </td>
                                    </tr> */}
                                </tbody>
                            </table>
                            
                            {/* Buttons */}
                            <div className='pt-2 pb-5 flex justify-end gap-2'>
                                <button className='py-2 px-5 rounded-md link-design1' onClick={clearProducts}>{t('Clear all')}</button>
                                <button className='py-2 px-5 rounded-md link-design1' onClick={saveProject}>{t('Save Project')}</button>
                            </div>

                            {/* Title */}
                            <div className='px-2 py-3 mb-2 bg-gray-800 text-white'>
                                <h4 className='text-xl'> {t('Add Product')} </h4>
                            </div>

                            {/* Search */}
                            <input type='text' onKeyDown={searchProds} className='border border-gray-200 w-full px-3 py-2 outline-none mb-2' placeholder={t('Search')}/>
                            
                            {/* Table */}
                            <table id='addp-main-table2' className="text-center min-w-full divide-y divide-gray-200">
                                <thead class="bg-gray-50">
                                <tr>
                                    <th scope="col" class="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">{t('Product image')}</th>
                                    <th scope="col" class="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">{t('Product name')}</th>
                                    <th scope="col" class="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">{t('Price')}</th>
                                    <th scope="col" class="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">{t('Wholesale Price')}</th>
                                    <th scope="col" class="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">{t('Diller Price')}</th>
                                    <th scope="col" class="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">{t('Quantity')}</th>
                                    <th scope="col" class="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">{t('Add')}</th>
                                </tr>
                                </thead>
                                <tbody>
                                {
                                    products.map(product=>{
                                      return(
                                          <tr className='prod_tr border-b border-gray-200' id={product.id}>
                                            <td>
                                              <img src={product.mainImage} width={70} height={70} className='aspect-square addp-item-img object-contain mx-auto' alt='Product'></img>
                                              {/* <Image src={ProductImg1} width={70} height={70} className='aspect-square addp-item-img object-contain mx-auto' alt='Product'/> */}
                                            </td>
                                            <td class="font-medium text-black hover:text-gray-700 transition ease-in prod_name">{product.name}</td>
                                            <td class="font-medium text-black hover:text-gray-700 transition duration-1 prod_price">{product.price}</td>
                                            <td class="font-medium text-black hover:text-gray-700 transition duration-1 prod_wholesale">{product.wholeSalePrice}₼</td>
                                            <td class="font-medium text-black hover:text-gray-700 transition duration-1 prod_diller">{product.dillerPrice}₼</td>
                                            <td class="font-medium text-black hover:text-gray-700 transition duration-1 prod_quant">1</td>
                                            <td class="font-medium text-black hover:text-gray-700 transition duration-1 prod_unit" style={{display:'none'}}>{product.unitOfMeasure}</td>
                                            <td class="font-medium text-black hover:text-gray-700 transition duration-1">
                                                <button className='font-bold inline-block text-base addp-projects-add-btn rounded-full' id={product.id} onClick={addProduct}>+</button>
                                            </td>
                                          </tr>
                                      )
                                    })
                                  }
                                    


                                </tbody>
                            </table>
                            
                            {/* <PaginationButtons /> */}
                        </div>
                    </div>        
                </div>            
          </div> 
        </section>

    </main>
  )
}

