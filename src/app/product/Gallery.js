import React, { useEffect, useState } from 'react'
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";

//;
// const imagess = [
//     {
//       original: "https://picsum.photos/id/1015/1000/600/",
//       thumbnail: "https://picsum.photos/id/1015/1000/600/",
//     },
//     {
//       original: "https://picsum.photos/id/1015/1000/600/",
//       thumbnail: "https://picsum.photos/id/1015/250/150/",
//     },
//     {
//       original: "https://picsum.photos/id/1019/1000/600/",
//       thumbnail: "https://picsum.photos/id/1019/250/150/",
//     },
//   ];

const Gallery = ({prod_id}) => {
   
   
  const [images, setImages] = useState([]);

  useEffect(() => {
    // Fetch images from an API when the component mounts
    const fetchImages = async () => {
      try {
        const params = new URLSearchParams();
        params.append('Id',prod_id)
        const response = await fetch(`http://89.40.2.200:3461/api/details/get-images?${params.toString()}`);
        if (!response.ok) {
          throw new Error('Failed to fetch images');
        }
        const data = await response.json();
        setImages(data.output);
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    };

    fetchImages(); // Call the fetchImages function
  }, []);
  //console.log(images)
  return (
    <ImageGallery items={images} />
  )
}

export default Gallery