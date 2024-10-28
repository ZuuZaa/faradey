'use client'

import React, { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import '../../../../i18n'
import { useParams  } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { UilEdit } from '@iconscout/react-unicons'
import Menu from '../../menu'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencil } from '@fortawesome/free-solid-svg-icons';
import Swal  from 'sweetalert2';

import { Card, Typography } from "@material-tailwind/react";
import ProductImg1 from  '../../../../../public/images/products/1.webp';
import { API_URL } from '@/constants';



export default function Project() {
  const { t, i18n } = useTranslation();

  const changeLanguage = async (event) => {
    const lng = event.currentTarget.textContent;
    await i18n.changeLanguage(lng);
    if (typeof localStorage !== "undefined") {
      localStorage.setItem("langId", lng);
    }
    const fetchedData = await mainFunc();
    setData(fetchedData);
    //const fetchedData1 = await mainFunc1();
    //setData1(fetchedData1);
  };

  let lang_id = "EN";
  const pathname = useParams();
  const id = pathname.id;

  const mainFunc = async () => {
    let status;
    let fav_data = [];

    const fetchData = async () => {
      let token = "";
      if (typeof localStorage !== "undefined") {
        token = localStorage.getItem("jwtToken");
        if (localStorage.getItem("langId") != null) {
          lang_id = localStorage.getItem("langId");
        }
      }
      const params = new URLSearchParams();
      params.append("Id", id);
      params.append("LanguageID", lang_id);
      let response = await fetch(
        `${API_URL}/api/projects/get-project-details?${params.toString()}`,
        {
          method: "GET",
          dataType: "json",
          headers: {
            Accept: "application/json, text/plain",
            "Content-Type": "application/json;charset=UTF-8",
            Authorization: "Bearer " + token,
          },
        }
      );
      const resp = await response.json();
      status = resp.status;
      fav_data = resp.output;
      //return resp.output;
    };

    await fetchData();

    if (status === 401) {
      try {
        let token = "";
        let refreshToken = "";
        if (typeof localStorage !== "undefined") {
          token = localStorage.getItem("jwtToken");
          refreshToken = localStorage.getItem("refreshToken");
        }
        let response = await fetch(
          `${API_URL}/api/account/refresh-token?userRefreshToken=${refreshToken}`,
          {
            method: "POST",
            dataType: "json",
            headers: {
              Accept: "application/json, text/plain",
              "Content-Type": "application/json;charset=UTF-8",
              Authorization: "Bearer " + token,
            },
          }
        );
        console.log(response);
        const resp = await response.json();

        if (resp.status !== 400) {
          if (typeof localStorage !== "undefined") {
            localStorage.setItem("refreshToken", resp.output.refreshToken);
            localStorage.setItem("jwtToken", resp.output.token);
          }

          await fetchData();
        } else {
          if (typeof window !== "undefined") {
            window.location.href = "/login";
          }
          //go to login page
          //alert(1)
        }
      } catch {
        console.log("error");
      }
    } else {
      return fav_data;
    }
  };

  //   const mainFunc1=async () => {
  //     let status;
  //     let fav_data=[];

  //     const fetchData = async () => {
  //         let token="";
  //         if (typeof localStorage !== 'undefined') {
  //             token = localStorage.getItem("jwtToken");
  //             if(localStorage.getItem("langId")!=null){
  //                 lang_id=localStorage.getItem("langId");
  //               }
  //         }
  //         const params = new URLSearchParams();
  //         params.append('LanguageID',lang_id);
  //         let response=await fetch(`${API_URL}/api/projects/get-project-settings?${params.toString()}`,{
  //             method: 'GET',
  //             dataType: 'json',
  //             headers: {
  //                 'Accept': 'application/json, text/plain',
  //                 'Content-Type': 'application/json;charset=UTF-8',
  //                 'Authorization': 'Bearer ' + token
  //             },
  //         }
  //         )
  //         console.log(response)
  //          const resp = await response.json();
  //          status=resp.status
  //          fav_data=resp.output
  //          //return resp.output;
  //     }

  //     await fetchData()

  //     if (status === 401) {
  //         try {
  //             let token="";
  //             let refreshToken="";
  //             if (typeof localStorage !== 'undefined') {
  //                 token = localStorage.getItem("jwtToken");
  //                 refreshToken=localStorage.getItem("refreshToken");
  //             }
  //             console.log(token)
  //             console.log(refreshToken)
  //             let response=await fetch(`${API_URL}/api/account/refresh-token?userRefreshToken=${refreshToken}`,{
  //                 method: 'POST',
  //                 dataType: 'json',
  //                 headers: {
  //                     'Accept': 'application/json, text/plain',
  //                     'Content-Type': 'application/json;charset=UTF-8',
  //                     'Authorization': 'Bearer ' + token
  //                 },
  //             })
  //             console.log(response)
  //             const resp = await response.json();

  //             if(resp.status !== 400) {
  //                 if (typeof localStorage !== 'undefined') {
  //                     localStorage.setItem("refreshToken", resp.output.refreshToken);
  //                     localStorage.setItem("jwtToken", resp.output.token);
  //                 }

  //                 await fetchData();
  //             } else {

  //                 if (typeof window !== 'undefined') {
  //                     window.location.href="/login"
  //                   }
  //                 //go to login page
  //                 //alert(1)
  //             }
  //         }
  //         catch {
  //             console.log("error")
  //         }
  //     }
  //     else{
  //         return fav_data
  //     }

  // }
  //const [properties, setData1] = useState(0);

  const [data, setData] = useState({
    project: [],
    projectProducts: [],
    subTotal: [],
    total: [],
    totalQuantity: [],
    user: [],
  });

  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [projectImage, setProjectImage] = useState("");
  const [projectName, setProjectName] = useState("");
  const [ProjectNote, setNote] = useState("");

  useEffect(() => {
    async function fetchDataAsync() {
      const fetchedData = await mainFunc();
      setData(fetchedData);
      setPhone(fetchedData.user[0].phone);
      setEmail(fetchedData.user[0].email);
      setCity(fetchedData.user[0].city);
      setProjectImage(fetchedData.project[0].image);
      setProfileImageFile();
      setProjectName(fetchedData.project[0].name);
      setNote(fetchedData.project[0].note);
      setProfileImage(fetchedData.user[0].profilImage);
      //const fetchedData1 = await mainFunc1();
      //setData1(fetchedData1);
      await i18n.changeLanguage(lang_id);
    }
    fetchDataAsync();
  }, []);

  const products = data.projectProducts;
  const subtotal = data.subTotal;
  const total = data.total;
  const totalQuantity = data.totalQuantity;
  useEffect(() => {
    // Get all elements with the class name 'lang_btn'
    const langBtns = document.getElementsByClassName("lang_btn");

    // Add click event listener to each button
    for (let i = 0; i < langBtns.length; i++) {
      langBtns[i].addEventListener("click", changeLanguage);
    }

    // Cleanup function to remove event listeners when the component unmounts
    return () => {
      for (let i = 0; i < langBtns.length; i++) {
        langBtns[i].removeEventListener("click", changeLanguage);
      }
    };
  }, []);

  let removeProduct = (e) => {
    let prod_id =
      e.currentTarget.parentElement.parentElement.getAttribute("id");
    let prod_tr = e.currentTarget.parentElement.parentElement;
    prod_tr.remove();
  };

  let orderProject = async (e) => {
    let arrayOfObjects = [];

    const table = document.getElementById("addp-main-table2");
    const rows = table
      .getElementsByTagName("tbody")[0]
      .getElementsByTagName("tr");
    for (let i = 0; i < rows.length; i++) {
      const cells = rows[i].getElementsByTagName("td");
      const rowData = {
        Id: rows[i].getAttribute("id"),
        UnitOfMeasure: 1,
        Quantity: parseInt(cells[4].firstElementChild.value),
        Price: parseFloat(cells[1].innerText.split("₼")[0]),
        WholesalePrice: parseFloat(cells[2].innerText.split("₼")[0]),
        DillerPrice: parseFloat(cells[3].innerText.split("₼")[0]),
        Note: cells[6].firstElementChild.value,
      };

      arrayOfObjects.push(rowData);
    }
    let token = "";
    let refreshToken = "";
    if (typeof localStorage !== "undefined") {
      token = localStorage.getItem("jwtToken");
      refreshToken = localStorage.getItem("refreshToken");
    }
    const formData = new FormData();
    formData.append("ProjectId", id);
    formData.append("Name", projectName);
    formData.append("Products", JSON.stringify(arrayOfObjects));
    formData.append("Status", 1);
    formData.append("Kind", 1);
    formData.append("ProjectNote", ProjectNote);
    formData.append("File", profileImageFile);
    try {
      const res = await fetch(`${API_URL}/api/projects/post-project`, {
        method: "POST",
        headers: {
          Authorization: "Bearer " + token,
        },
        body: formData,
      });
      const resJson = await res.json();
      if (res.status === 200) {
        Swal.fire({
          title: "Great!",
          text: "Project ordered successfully.",
          icon: "success",
          showConfirmButton: false,
          timer: 4000,
        });
        window.location.href = "/account/projects";
      } else {
        Swal.fire({
          title: "Some error occured!",
          text: resJson.output.message,
          icon: "error",
          showConfirmButton: false,
          timer: 4000,
        });
      }
    } catch (err) {
      console.log(err);
    }
  };
  let saveProject = async (e) => {
    let arrayOfObjects = [];

    const table = document.getElementById("addp-main-table2");
    const rows = table
      .getElementsByTagName("tbody")[0]
      .getElementsByTagName("tr");
    for (let i = 0; i < rows.length; i++) {
      const cells = rows[i].getElementsByTagName("td");
      const rowData = {
        Id: rows[i].getAttribute("id"),
        UnitOfMeasure: 1,
        Quantity: parseInt(cells[4].firstElementChild.value),
        Price: parseFloat(cells[1].innerText.split("₼")[0]),
        WholesalePrice: parseFloat(cells[2].innerText.split("₼")[0]),
        DillerPrice: parseFloat(cells[3].innerText.split("₼")[0]),
        Note: cells[6].firstElementChild.value,
      };

      arrayOfObjects.push(rowData);
    }
    let token = "";
    let refreshToken = "";
    if (typeof localStorage !== "undefined") {
      token = localStorage.getItem("jwtToken");
      refreshToken = localStorage.getItem("refreshToken");
    }
    console.log(arrayOfObjects);
    const formData = new FormData();
    formData.append("ProjectId", id);
    formData.append("Name", projectName);
    formData.append("Products", JSON.stringify(arrayOfObjects));
    formData.append("Status", 1);
    formData.append("Kind", 1);
    formData.append("ProjectNote", ProjectNote);
    formData.append("File", profileImageFile);

    try {
      const res = await fetch(`${API_URL}/api/projects/post-project`, {
        method: "POST",
        headers: {
          Authorization: "Bearer " + token,
        },
        body: formData,
      });
      const resJson = await res.json();
      if (res.status === 200) {
        Swal.fire({
          title: "Great!",
          text: "Project saved successfully.",
          icon: "success",
          showConfirmButton: false,
          timer: 4000,
        });
      } else {
        Swal.fire({
          title: "Some error occured!",
          text: resJson.output.message,
          icon: "error",
          showConfirmButton: false,
          timer: 4000,
        });
      }
    } catch (err) {
      console.log(err);
    }
  };
  let removeProject = async (e) => {
    let token = "";
    let refreshToken = "";
    if (typeof localStorage !== "undefined") {
      token = localStorage.getItem("jwtToken");
      refreshToken = localStorage.getItem("refreshToken");
    }

    try {
      const res = await fetch(`${API_URL}/api/projects/remove-project`, {
        method: "POST",
        headers: {
          Accept: "application/json, text/plain",
          "Content-Type": "application/json;charset=UTF-8",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({
          ProjectId: id,
          Kind: 2,
        }),
      });
      console.log(res);
      //const resJson = await res.json();
      if (res.status === 200) {
        window.location.href = "/account/projects";
      } else {
        console.log("Some error occured");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const sectionRef = useRef(null);

  function downloadPDF(byteArray, fileName) {
    // Create a new Blob object using the byte array
    //const byteArrayy = new Uint8Array(byteArray);
    const binaryString = window.atob(byteArray);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    const blob = new Blob([bytes], { type: "application/pdf" });

    // Create a URL for the blob
    const url = window.URL.createObjectURL(blob);

    // Create a temporary anchor element and trigger the download
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", fileName || "download.pdf");
    document.body.appendChild(link);
    link.click();

    // Clean up by revoking the URL and removing the link
    window.URL.revokeObjectURL(url);
    document.body.removeChild(link);
  }
  let handleSubmit = async (e) => {
    const params1 = new URLSearchParams();
    params1.append("document", id);
    try {
      const res = await fetch(
        `${API_URL}/api/projects/get-pdf?${params1.toString()}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json, text/plain",
            "Content-Type": "application/json;charset=UTF-8",
          },
        }
      );

      if (res.status === 200) {
        const resJson = await res.json();
        downloadPDF(resJson.output, "test");
      } else {
        console.log(res);
      }
    } catch (err) {
      console.log(err);
    }
  };

  let sendMail = async (e) => {
    e.preventDefault();
    console.log(id);
    try {
      const res = await fetch(`${API_URL}/api/projects/send-mail-project`, {
        method: "POST",
        headers: {
          Accept: "application/json, text/plain",
          "Content-Type": "application/json;charset=UTF-8",
        },
        body: JSON.stringify({
          Id: id,
        }),
      });

      if (res.status === 200) {
        const resJson = await res.json();
        console.log(resJson);
      } else {
        console.log(res);
      }
    } catch (err) {
      console.log(err);
    }
  };

  let changePrice = async (e) => {
    let option = e.currentTarget.value;
    console.log(option);
    let retail = document
      .getElementById("addp-main-table2")
      .getElementsByClassName("retail_prc");
    let whole = document
      .getElementById("addp-main-table2")
      .getElementsByClassName("whole_prc");
    let diller = document
      .getElementById("addp-main-table2")
      .getElementsByClassName("diller_prc");
    if (option == 1) {
      for (let i = 0; i < retail.length; i++) {
        retail[i].style.display = "none";
        whole[i].style.display = "none";
        diller[i].style.display = "block";
      }
    } else if (option == 2) {
      for (let i = 0; i < retail.length; i++) {
        retail[i].style.display = "none";
        whole[i].style.display = "block";
        diller[i].style.display = "none";
      }
    } else if (option == 3) {
      for (let i = 0; i < retail.length; i++) {
        retail[i].style.display = "block";
        whole[i].style.display = "none";
        diller[i].style.display = "none";
      }
    } else {
      for (let i = 0; i < retail.length; i++) {
        retail[i].style.display = "revert";
        whole[i].style.display = "revert";
        diller[i].style.display = "revert";
      }
    }
    let token = "";
    let refreshToken = "";
    if (typeof localStorage !== "undefined") {
      token = localStorage.getItem("jwtToken");
      refreshToken = localStorage.getItem("refreshToken");
    }
    try {
      const res = await fetch(`${API_URL}/api/projects/change-prices-project`, {
        method: "POST",
        headers: {
          Accept: "application/json, text/plain",
          "Content-Type": "application/json;charset=UTF-8",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({
          ProjectId: id,
          Kind: 3,
          PriceType: option,
        }),
      });
      console.log(res);
      const resJson = await res.json();
      if (res.status === 200) {
        console.log("Prices changed successfully");
      } else {
        Swal.fire({
          title: "Some error occured!",
          text: resJson.output.message,
          icon: "error",
          showConfirmButton: false,
          timer: 4000,
        });
      }
    } catch (err) {
      console.log(err);
    }
  };
  const [profileImage, setProfileImage] = useState(null);
  const [profileImageFile, setProfileImageFile] = useState(null);

  // Profil fotoğrafını değiştirmek için dosya seçme işlemi
  const handleFileInputChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setProfileImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProjectImage(reader.result);
        // const storage = multer.diskStorage({
        //     destination: './public/uploads', // Ensure this directory exists
        //     filename: (req, file, cb) => {
        //       cb(null, `${Date.now()}_${file.originalname}`);
        //     },
        //   });

        //   const upload = multer({ storage });
        //   const apiRoute = nextConnect({
        //     onError(error, req, res) {
        //       res.status(501).json({ error: `Something went wrong: ${error.message}` });
        //     },
        //     onNoMatch(req, res) {
        //       res.status(405).json({ error: `Method ${req.method} not allowed` });
        //     },
        //   });

        //   apiRoute.use(upload.single('file'));

        //   apiRoute.post((req, res) => {
        //     res.status(200).json({ data: 'success' });
        //   });

        // Profil fotoğrafı burada kaydedilebilir veya API'ye gönderilebilir
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <main>
      {/* Breadcrumb */}
      <div className="breadcrumb-wrapper py-8">
        <div className="custom-container mx-auto">
          <div className="flex" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
              <li className="inline-flex items-center">
                <a
                  href="/account"
                  className="inline-flex items-center text-sm font-medium"
                >
                  {" "}
                  {t("My Account")}{" "}
                </a>
              </li>

              <li>
                <div className="flex items-center">
                  <a href="#" className="ms-1 text-sm font-medium md:ms-2">
                    {t("Project Details")}
                  </a>
                </div>
              </li>
            </ol>
          </div>
        </div>
      </div>

      {/* Account Section */}
      <section className="account-page-main-section my-20 py-3">
        <div className="custom-container mx-auto">
          <div className="flex">
            <div className="account-page-menu w-2/5">
              <h5 className="title relative mb-5 text-lg">{t("My Account")}</h5>
              <Menu />
            </div>

            <div className="account-page-main w-3/5">
              <div className="account-projects-wrapper px-3 pb-4">
                <div className="">
                  <div className="account-projects-wrap">
                    <div className="title flex justify-between items-center border-b-2 mb-5">
                      <h2 className="text-lg leading-10">{projectName}</h2>
                      <div className="flex justify-between items-center gap-2">
                        {t("Edit")}
                        <FontAwesomeIcon icon={faPencil} />
                        {/* <UilEdit size='23' className='cursor-pointer text-gray-800 hover:text-red-600'/> */}
                      </div>
                    </div>
                    <div>
                      <div ref={sectionRef}>
                        {/* Info */}
                        <div className="flex justify-between">
                          <div className="profile-photo-wrapper">
                            <div className="profile-picture">
                              {/* Profil fotoğrafı */}
                              {projectImage ? (
                                <img src={projectImage} alt="Profil" />
                              ) : (
                                <img src={profileImage} alt="Project" />
                              )}

                              {/* Edit düğmesi */}
                              <label
                                htmlFor="file-upload"
                                className="edit-button"
                              >
                                <FontAwesomeIcon icon={faPencil} />
                                {/* <i className="fa-solid fa-pencil"></i> */}
                              </label>
                              <input
                                id="file-upload"
                                type="file"
                                accept="image/*"
                                onChange={handleFileInputChange}
                                style={{ display: "none" }}
                              />
                            </div>
                                 {" "}
                          </div>
                          {/* <div className='projectdetail-img'>
                                                    <img src={projectImage} width={170} height={170} className='aspect-square addp-item-img object-contain mx-auto border' alt='Product'></img>
                                                    
                                                </div> */}
                          <div className="projectdetail-info">
                            <div className="mb-3">
                              <h5>{t("Phone")}:</h5>
                              <input
                                type="tel"
                                className="border border-gray-200 w-full px-3 py-2 outline-none mb-2"
                                defaultValue={phone}
                                disabled
                              />
                            </div>
                            <div className="mb-3">
                              <h5>{t("Address")}:</h5>
                              <input
                                type="text"
                                className="border border-gray-200 w-full px-3 py-2 outline-none mb-2"
                                defaultValue={city}
                                disabled
                              />
                            </div>
                            <div className="mb-3">
                              <h5>{t("Email")}:</h5>
                              <input
                                type="email"
                                className="border border-gray-200 w-full px-3 py-2 outline-none mb-2"
                                defaultValue={email}
                                disabled
                              />
                            </div>
                          </div>
                        </div>

                        {/* Table */}
                        <table
                          id="addp-main-table2"
                          className="text-center min-w-full divide-y divide-gray-200"
                        >
                          <thead className="bg-gray-50">
                            {/* {
                                                        properties==0?(<tr>
                                                            <th scope="col" class="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">{t('Product name')}</th>
                                                            <th scope="col" class="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">{t('Price')}</th>
                                                            <th scope="col" class="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">{t('Quantity')}</th>
                                                            <th scope="col" class="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">{t('Total')}</th>
                                                            <th scope="col" class="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">{t('Note')}</th>
                                                            <th scope="col" class="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">{t('Remove')}</th>
                                                        </tr>):( */}
                            <tr>
                              <th
                                scope="col"
                                class="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider"
                              >
                                {t("Product name")}
                              </th>
                              <th
                                scope="col"
                                class="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider retail_prc"
                              >
                                {t("Price")}
                              </th>
                              <th
                                scope="col"
                                class="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider whole_prc"
                              >
                                {t("Wholesale Price")}
                              </th>
                              <th
                                scope="col"
                                class="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider diller_prc"
                              >
                                {t("Diller Price")}
                              </th>
                              <th
                                scope="col"
                                class="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider"
                              >
                                {t("Quantity")}
                              </th>
                              <th
                                scope="col"
                                class="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider"
                              >
                                {t("Total")}
                              </th>
                              <th
                                scope="col"
                                class="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider"
                              >
                                {t("Note")}
                              </th>
                              <th
                                scope="col"
                                class="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider"
                              >
                                {t("Remove")}
                              </th>
                            </tr>
                            {/* )
                                                    } */}
                          </thead>
                          <tbody>
                            {products.map((product) => {
                              return (
                                //     properties==0?(<tr className='border-b border-gray-200' id={product.productId}>

                                //     <td className="font-medium text-black hover:text-gray-700 transition ease-in">{product.productName}</td>
                                //     <td className="font-medium text-black hover:text-gray-700 transition duration-1">{product.price}₼</td>
                                //     <td className="font-medium text-black hover:text-gray-700 transition duration-1"><input type='number' style={{textAlign:"center",width:"100%"}} defaultValue={product.quantity}/></td>
                                //     <td className="font-medium text-black hover:text-gray-700 transition duration-1">{product.total}₼</td>
                                //     <td className="font-medium text-black hover:text-gray-700 transition duration-1"><input type='text' style={{textAlign:"center",width:"100%"}} defaultValue={product.note}/></td>
                                //     <td className="font-medium text-black hover:text-gray-700 transition duration-1">
                                //         <button className='font-bold inline-block text-base addp-projects-remove-btn rounded-full' onClick={removeProduct}>x</button>
                                //     </td>
                                // </tr>):(
                                <tr
                                  className="border-b border-gray-200"
                                  id={product.productId}
                                >
                                  <td className="font-medium text-black hover:text-gray-700 transition ease-in">
                                    {product.productName}
                                  </td>
                                  <td className="font-medium text-black hover:text-gray-700 transition duration-1 retail_prc">
                                    {product.price}₼
                                  </td>
                                  <td className="font-medium text-black hover:text-gray-700 transition duration-1 whole_prc">
                                    {product.wholesalePrice}₼
                                  </td>
                                  <td className="font-medium text-black hover:text-gray-700 transition duration-1 diller_prc">
                                    {product.dillerPrice}₼
                                  </td>
                                  <td className="font-medium text-black hover:text-gray-700 transition duration-1">
                                    <input
                                      id="quant"
                                      type="number"
                                      style={{
                                        textAlign: "center",
                                        width: "100%",
                                      }}
                                      defaultValue={product.quantity}
                                    />
                                  </td>
                                  <td className="font-medium text-black hover:text-gray-700 transition duration-1">
                                    {product.total}₼
                                  </td>
                                  <td className="font-medium text-black hover:text-gray-700 transition duration-1">
                                    <input
                                      id="notee"
                                      type="text"
                                      style={{
                                        textAlign: "center",
                                        width: "100%",
                                      }}
                                      defaultValue={product.note}
                                    />
                                  </td>
                                  <td className="font-medium text-black hover:text-gray-700 transition duration-1">
                                    <button
                                      className="font-bold inline-block text-base addp-projects-remove-btn rounded-full"
                                      onClick={removeProduct}
                                    >
                                      x
                                    </button>
                                  </td>
                                </tr>
                                // )
                              );
                            })}
                          </tbody>
                        </table>
                      </div>

                      {/* Product Detail Page Bottom Extra Infos */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-5">
                        <div>
                          <input
                            type="text"
                            className="border border-gray-200 w-full px-3 py-2 outline-none mb-2"
                            placeholder={t("Text")}
                            defaultValue={ProjectNote}
                            onChange={(e) => setNote(e.target.value)}
                          />

                          <div className="flex gap-2 my-9">
                            <select
                              className="border border-gray-200 w-full px-3 py-2 outline-none mb-2"
                              onChange={changePrice}
                            >
                              <option value="0">{t("View all")}</option>
                              <option value="1">{t("Diller")}</option>
                              <option value="2">{t("Wholesale")}</option>
                              <option value="3">{t("Retail")}</option>
                            </select>
                          </div>
                        </div>

                        <div className="mb-5 md:mb-0">
                          <div className="flex gap-2 justify-end">
                            <h6>{t("Total")}:</h6>
                            <h6>{subtotal}</h6>
                          </div>
                          <div className="flex gap-2 justify-end">
                            <h6>{t("Price")}:</h6>
                            <h6>{total}</h6>
                          </div>
                          <div className="flex gap-2 justify-end">
                            <h6>{t("VAT")}:</h6>
                            <h6>0</h6>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 justify-between">
                        <button
                          className="py-2 px-5 rounded-sm link-design1"
                          onClick={saveProject}
                        >
                          {t("Save Project")}
                        </button>
                        <button
                          className="py-2 px-5 rounded-sm link-design2"
                          onClick={removeProject}
                        >
                          {t("Remove Project")}
                        </button>
                      </div>
                      <hr className="my-4" />
                      <div className="flex justify-between">
                        <div className="w-full md:w-3/4">
                          <div className="flex gap-2 justify-start mb-4">
                            <Link
                              href=""
                              className="underline"
                              onClick={handleSubmit}
                            >
                              {t("Download PDF")}
                            </Link>
                          </div>
                          <div className="flex gap-2 justify-start mb-4">
                            <Link
                              href=""
                              onClick={sendMail}
                              className="underline"
                            >
                              {t("Send to email")}
                            </Link>
                          </div>
                        </div>
                        <div className="w-full md:w-1/4 text-right">
                          <button
                            className="py-2 px-5 rounded-sm bg-yellow-400 hover:bg-yellow-600"
                            onClick={orderProject}
                          >
                            {t("Order")}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

