'use client'

import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import '../../../i18n'
import Menu from '../menu'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencil } from '@fortawesome/free-solid-svg-icons';
import { API_URL } from '@/constants';
// import nextConnect from "next-connect";
// import multer from "multer";

export default function Profile() {
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
    const fetchData=async () => {
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
            const params = new URLSearchParams();
            params.append('LanguageID',lang_id);
            let response=await fetch(`${API_URL}/api/profile/get-index?${params.toString()}`,{
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
                let response=await fetch(`${API_URL}/api/account/refresh-token?userRefreshToken=${refreshToken}`,{
                    method: 'POST',
                    dataType: 'json',
                    headers: {
                        'Accept': 'application/json, text/plain',
                        'Content-Type': 'application/json;charset=UTF-8',
                        'Authorization': 'Bearer ' + token
                    },
                })
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

    const [data, setData] = useState({ 
                                    user: [], 
                                    userAddress: [], 
                                    userOrders: []
                                    });
    
    useEffect(() => {
        async function fetchDataAsync() {
            try{
                const fetchedData = await fetchData();
                console.log(fetchedData.user)
                setData(fetchedData);
                setUserId(fetchedData.user[0].id)
                setFirstName(fetchedData.user[0].firstName)
                setLastName(fetchedData.user[0].lastName)
                setPhone(fetchedData.user[0].phone)
                setEmail(fetchedData.user[0].email)
                setCity(fetchedData.user[0].city)
                setArea(fetchedData.user[0].area)
                setStreet(fetchedData.user[0].street)
                setBuilding(fetchedData.user[0].building)
                setKorpus(fetchedData.user[0].korpus)
                setEntrance(fetchedData.user[0].entrance)
                setFloor(fetchedData.user[0].floor)
                setApartment(fetchedData.user[0].apartment)
                setLegal(fetchedData.user[0].legalStatus)
                setCompany(fetchedData.user[0].companyName)
                setPosition(fetchedData.user[0].position)
                setVoen(fetchedData.user[0].voen)
                if(fetchedData.user[0].birthDate!=null){
                    setBirthdate(fetchedData.user[0].birthDate.split('T')[0])
                }
                setGender(fetchedData.user[0].gender)
                setProfileImage(fetchedData.user[0].profilImage);
                await i18n.changeLanguage(lang_id);
            }
            catch(error){
                console.log(error)
            }
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

    const [userId, setUserId]=useState(0);
    const [firstname, setFirstName] = useState("");
    const [lastname, setLastName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [city, setCity] = useState("");
    const [area, setArea] = useState("");
    const [street, setStreet] = useState("");
    const [building, setBuilding] = useState("");
    const [korpus, setKorpus] = useState("");
    const [entrance, setEntrance] = useState("");
    const [floor, setFloor] = useState("");
    const [apartment, setApartment] = useState("");
    const [legal, setLegal] = useState(0);
    const [company, setCompany] = useState("");
    const [position, setPosition] = useState("");
    const [voen, setVoen] = useState("");
    const [birthdate, setBirthdate] = useState("");
    const [gender,setGender]=useState(0);
    const [message, setMessage] = useState("");
    const [profileImage, setProfileImage] = useState("");
    const [profileImageFile, setProfileImageFile] = useState(null);


     let handleSubmit = async (e) => {
        e.preventDefault();
        let token="";
        if (typeof localStorage !== 'undefined') {
            token = localStorage.getItem("jwtToken");
        }
        const formData = new FormData();
        //formData.append('Id', userId);
        formData.append('FirstName', firstname);
        formData.append('LastName', lastname);
        formData.append('Email', email);
        formData.append('Phone', phone);
        formData.append('Birthdate', birthdate);
        formData.append('Gender', gender);
        formData.append('City', city);
        formData.append('Area', area);
        formData.append('Street', street);
        formData.append('Building', building);
        formData.append('Korpus', korpus);
        formData.append('Entrance', entrance);
        formData.append('Floor', floor);
        formData.append('Apartment', apartment);
        formData.append('Legal', legal);
        formData.append('Company', company);
        formData.append('Position', position);
        formData.append('Voen', voen);
        formData.append('File', profileImageFile);
        // let body=JSON.stringify({
        //     Id:userId,
        //     FirstName: firstname,
        //     LastName: lastname,
        //     Email:email,
        //     Phone:phone,
        //     Birthdate:birthdate,
        //     Gender:gender,
        //     City:city,
        //     Area:area,
        //     Street:street,
        //     Building:building,
        //     Korpus:korpus,
        //     Entrance:entrance,
        //     Floor:floor,
        //     Apartment:apartment,
        //     Legal:legal,
        //     Company:company,
        //     Position:position,
        //     Voen:voen,
        //     ImageName:profileImageFile

        //   })
        for (var pair of formData.entries()) {
            console.log(pair[0]+ ': ' + pair[1]);
        }
        try {
          const res = await fetch(`${API_URL}/api/profile/edit-profile`, {
            method: "POST",
            headers: {
              'Authorization': 'Bearer ' + token
            },
            body: formData
          });
          
          if (res.status === 200) {
            const resJson = await res.json();
            setData(resJson.output)
            setMessage(t('Profile has been updated successfully'));
          } else {
            setMessage(t('Some error occured'));
          }
        } catch (err) {
          console.log(err);
        }
      };

      

        // Profil fotoğrafını değiştirmek için dosya seçme işlemi
        const handleFileInputChange = (e) => {
            const file = e.target.files[0];
            
            if (file) {
                setProfileImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileImage(reader.result);
                
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
            <div className='breadcrumb-wrapper py-8'>
                <div className='custom-container mx-auto'>
                    <div className="flex" aria-label="Breadcrumb">
                        <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">

                            <li className="inline-flex items-center">
                                <a href="/" className="inline-flex items-center text-sm font-medium">{t('My Account')}</a>
                            </li>

                            <li>
                                <div className="flex items-center">
                                    <a href="#" className="ms-1 text-sm font-medium md:ms-2">{t('Profile')}</a>
                                </div>
                            </li>
                            
                        </ol>
                    </div>
                </div>
            </div>
            {/* Account Section */}
            <section className='account-page-main-section my-20 py-3'>
                <div className='custom-container mx-auto'>
                    <div className='flex'>
                       
                        <div className='account-page-menu w-2/5'>
                            <h5 className='title relative mb-5 text-lg'>{t('My Account')}</h5>
                            <Menu />
                        </div>
                        <div className='account-page-main w-3/5'>
                            <div className='account-personal-information-wrapper'>
                                <div className="w-full">
                                     
                                    <form className="px-8 pt-6 pb-8 mb-4 grid grid-cols-2 gap-3" onSubmit={handleSubmit}>
                                        <div className="profile-photo-wrapper">
                                            <div className="profile-picture">
                                                {/* Profil fotoğrafı */}
                                                {profileImage ? (
                                                <img src={profileImage} alt="Profil" />
                                                ) : (
                                                <img src='https://imgv3.fotor.com/images/blog-cover-image/10-profile-picture-ideas-to-make-you-stand-out.jpg' alt="Profil" />
                                                )}

                                                {/* Edit düğmesi */}
                                                <label htmlFor="file-upload" className="edit-button">
                                                <FontAwesomeIcon icon={faPencil} />
                                                    {/* <i className="fa-solid fa-pencil"></i> */}
                                                </label>
                                                <input
                                                    id="file-upload"
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleFileInputChange}
                                                    style={{ display: 'none' }}
                                                />
                                            </div>
                                        </div>
                                        <div className="mb-4">
                                            <label className="block text-gray-700 text-sm font-semibold mb-2" for="name"> {t('First Name')} </label>
                                            <input  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                                                    id="name"  type="text" placeholder={t('First Name')} defaultValue={firstname} onChange={(e) => setFirstName(e.target.value)} />
                                        </div>
                                        <div className="mb-4">
                                            <label className="block text-gray-700 text-sm font-semibold mb-2" for="surname"> {t('Last Name')} </label>
                                            <input  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                                                    id="surname"  type="text" placeholder={t('Last Name')} defaultValue={lastname} onChange={(e) => setLastName(e.target.value)}/>
                                        </div>
                                        <div className="mb-4">
                                            <label className="block text-gray-700 text-sm font-semibold mb-2" for="phone"> {t('Phone')} </label>
                                            <input  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                                                    id="phone"  type="tel" placeholder={t('Phone')} defaultValue={phone} onChange={(e) => setPhone(e.target.value)}/>
                                        </div>
                                        <div className="mb-4">
                                            <label className="block text-gray-700 text-sm font-semibold mb-2" for="email"> {t('Email')} </label>
                                            <input  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                                                    id="email"  type="email" placeholder={t('Email')} readOnly defaultValue={email} onChange={(e) => setEmail(e.target.value)}/>
                                        </div>
                                        <div className="mb-4">
                                            <label className="block text-gray-700 text-sm font-semibold mb-2" for="city"> {t('City')} </label>
                                            <input  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                                                    id="city"  type="text" placeholder={t('City')} defaultValue={city} onChange={(e) => setCity(e.target.value)}/>
                                        </div>
                                        <div className="mb-4">
                                            <label className="block text-gray-700 text-sm font-semibold mb-2" for="area"> {t('Area')} </label>
                                            <input  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                                                    id="area"  type="text" placeholder={t('Area')} defaultValue={area} onChange={(e) => setArea(e.target.value)}/>
                                        </div>
                                        <div className="mb-4">
                                            <label className="block text-gray-700 text-sm font-semibold mb-2" for="street"> {t('Street')} </label>
                                            <input  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                                                    id="street"  type="text" placeholder={t('Street')} defaultValue={street} onChange={(e) => setStreet(e.target.value)}/>
                                        </div>
                                        <div className="mb-4">
                                            <label className="block text-gray-700 text-sm font-semibold mb-2" for="building"> {t('Building')} </label>
                                            <input  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                                                    id="building"  type="text" placeholder={t('Building')} defaultValue={building} onChange={(e) => setBuilding(e.target.value)}/>
                                        </div>
                                        <div className="mb-4">
                                            <label className="block text-gray-700 text-sm font-semibold mb-2" for="korpus"> {t('Corpus')} </label>
                                            <input  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                                                    id="korpus"  type="text" placeholder={t('Corpus')} defaultValue={korpus} onChange={(e) => setKorpus(e.target.value)}/>
                                        </div>
                                        <div className="mb-4">
                                            <label className="block text-gray-700 text-sm font-semibold mb-2" for="entrance"> {t('Entrance')} </label>
                                            <input  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                                                    id="entrance"  type="text" placeholder={t('Entrance')} defaultValue={entrance} onChange={(e) => setEntrance(e.target.value)}/>
                                        </div>
                                        <div className="mb-4">
                                            <label className="block text-gray-700 text-sm font-semibold mb-2" for="floor"> {t('Floor')} </label>
                                            <input  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                                                    id="floor"  type="text" placeholder={t('Floor')} defaultValue={floor} onChange={(e) => setFloor(e.target.value)}/>
                                        </div>
                                        <div className="mb-4">
                                            <label className="block text-gray-700 text-sm font-semibold mb-2" for="apartment"> {t('Apartment')} </label>
                                            <input  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                                                    id="apartment"  type="text" placeholder={t('Apartment')} defaultValue={apartment} onChange={(e) => setApartment(e.target.value)}/>
                                        </div>
                                        
                                        <div className="mb-4">
                                            <label className="block text-gray-700 text-sm font-semibold mb-2" for="company"> {t('Company')} </label>
                                            <input  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                                                    id="company"  type="text" placeholder={t('Company')} defaultValue={company} onChange={(e) => setCompany(e.target.value)}/>
                                        </div>
                                        <div className="mb-4">
                                            <label className="block text-gray-700 text-sm font-semibold mb-2" for="position"> {t('Position')} </label>
                                            <input  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                                                    id="position"  type="text" placeholder={t('Position')} defaultValue={position} onChange={(e) => setPosition(e.target.value)}/>
                                        </div>
                                        <div className="mb-4">
                                            <label className="block text-gray-700 text-sm font-semibold mb-2" for="choice"> {t('Legal Status')}</label>
                                            <select className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="choice" onChange={(e) => setLegal(e.target.value)}>
                                                
                                                <option value="1">{t('Individual')}</option>
                                                <option value="2">{t('Juridical')}</option>
                                            </select>
                                        </div>
                                        <div className="mb-4">
                                            <label className="block text-gray-700 text-sm font-semibold mb-2" for="voen"> {t('TIN')} </label>
                                            <input  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                                                    id="voen"  type="text" placeholder={t('TIN')} defaultValue={voen} onChange={(e) => setVoen(e.target.value)}/>
                                        </div>
                                        <div className="mb-4">
                                            <label className="block text-gray-700 text-sm font-semibold mb-2" for="birthdate">{t('Birth Date')}  </label>
                                            <input  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                                                    id="birthdate"  type="date" defaultValue={birthdate} onChange={(e) => setBirthdate(e.target.value)}/>
                                        </div>
                                        <div className="mb-4">
                                            <label className="block text-gray-700 text-sm font-semibold mb-2" for="birthdate">{t('Gender')}  </label>
                                            <select className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="choice" onChange={(e) => setGender(e.target.value)}>
                                                <option value="1">{t('Male')}</option>
                                                <option value="2">{t('Female')}</option>
                                                <option value="0">{t('Not Important')}</option>
                                            </select>
                                        </div>
                                        {/* <div className="mb-6">
                                            <label className="block text-gray-700 text-sm font-semibold mb-2" type="password"> Password </label>
                                            <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" 
                                                   id="password"   type="password" placeholder="***********" />
                                            <p className="text-red-500 text-xs italic"></p>
                                        </div> */}

                                        <div className="flex items-center justify-between w-full">
                                            <button className="bg-slate-600 hover:bg-slate-800 w-full text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit"> {t('Submit')} </button>
                                        </div>
                                        <div className="message mt-4">{message ? <p>{message}</p> : null}</div>
                                    </form>
                                            
                                    
                                </div>
                            </div>
                        </div>
                        

                    </div>
                </div>
            </section>
            

        </main>

    )
}

