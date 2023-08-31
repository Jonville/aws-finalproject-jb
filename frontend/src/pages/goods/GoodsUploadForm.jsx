import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

import '../../styles/base/sub.css'
import '../../styles/base/goodsStyle.css'


const GoodsUploadForm = () => {
  const navigate = useNavigate();

  /* 굿즈 정보 */
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [content, setContent] = useState("");
  const [sale_yn, setSale_Yn] = useState("");
  const [inventory, setInventory] = useState("");

  /* 굿즈 img */
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [contentFile, setContentFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [contentPreview, setContentPreview] = useState(null);

  const handleThumbnailFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setThumbnailFile(selectedFile);
    setThumbnailPreview(URL.createObjectURL(selectedFile)); // Create a preview URL
  };

  const handleContentFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setContentFile(selectedFile);
    setContentPreview(URL.createObjectURL(selectedFile)); // Create a preview URL
  };

  //handleUploadSubmit
  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`/api/goods/upload`, { // 상품 정보
        name: name,
        price: price,
        content: content,
        inventory: inventory,
        sale_yn: "Y",
        images_no: null
      });

      const goodsNo = response.data.no;
      await axios.put(`/api/goods/${goodsNo}`, { // 이미지 불러오기
        name: name,
        price: price,
        content: content,
        likes : 0,
        inventory: inventory,
        sale_yn: "Y",
        images_no: null
      });

      // 썸네일 이미지 업로드 요청
      const thumbnailFormData = new FormData();
      thumbnailFormData.append('file',thumbnailFile);
      await axios.post(`/api/save/thumbnail?goodsNo=${goodsNo}`, thumbnailFormData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      // 내용 이미지 업로드 요청
      const contentFormData = new FormData();
      contentFormData.append('file', contentFile);
      await axios.post(`/api/save/content?goodsNo=${goodsNo}`, contentFormData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      alert('상품 등록 완료');
      navigate('/goods');

    } catch(err) {
      console.log('상품 등록 / 이미지 업로드 실패 : ' + err);
      alert('상품 등록 실패');
    }
    
  };

  // handleCancel
  const handleCancel = () => {
    if(confirm("제품등록을 취소하시겠습니까?") === true) {
      return navigate(`/goods`);
    } else {
      return null;
    };
  };


  return (
    <section className='formSection'>
      <form className='formArea'  onSubmit={handleUploadSubmit}>
        <div className='infoBox'>
          <div className='goodsName'>
            <p> 제품명 </p>
            <input 
              type='text' 
              placeholder='제품명을 입력하세요.' 
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className='goodsPrice'>
            <p> 제품가격 </p>
            <input 
              type='number' 
              placeholder='제품가격을 입력하세요.'
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>

          <div className='goodsInventory'>
            <p> 제품수량 </p>
            <input
              type='number'
              placeholder='제품수량을 입력하세요.'
              value={inventory}
              onChange={(e) => setInventory(e.target.value)}
            />
          </div>

          <div className='goodsSaleYn'>
            <p> 판매상태 </p>
            <select name="sale_yn" onChange={(e) => setSale_Yn(e.target.value)}>
              <option value="Y">판매가능</option>
              <option value="N">품절</option>
            </select>
          </div>

          <div className='goodsContent'>
            <p> 제품설명 </p>
            <textarea 
              type="text"
              placeholder='상세정보를 입력하세요.' 
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>

          <section className='imgSection'>
          <div className='sectionInner'>
            <label>썸네일 이미지 <small>&#40;600*600&#41;</small></label>
            <input
              type="file"
              accept="image/*"
              onChange={handleThumbnailFileChange}
              className='thumbnailImage'
            />
            {
              thumbnailPreview &&
              <img className='previewImage' src={thumbnailPreview} alt="Thumbnail Preview" />
            }
          </div>
          <div className='sectionInner'>
            <label>내용 이미지 <small>&#40;5MB 이하&#41;</small></label>
            <input
              type="file"
              accept="image/*"
              onChange={handleContentFileChange}
              className='contentImage'
            />
            {
              contentPreview &&
              <img className='previewImage' src={contentPreview} alt="Content Preview" />
            }
          </div>
        </section>
          <div className="btnBox">
            <button className="submit" type="submit"> 등록하기 </button>
            <button className="cancel" type="button" onClick={handleCancel}> 취소 </button>
          </div>

        </div>
      </form>
    </section>
  )
}

export default GoodsUploadForm