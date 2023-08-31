import React, { useState , useEffect } from 'react'
import axios from 'axios'
import { useNavigate , useParams } from 'react-router-dom'

import '../../styles/base/sub.css'
import '../../styles/base/goodsStyle.css'


const GoodsEditForm = () => {
  const { no } = useParams();
  const navigate = useNavigate();

  /* 굿즈 정보 */
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [content, setContent] = useState("");
  const [sale_yn, setSale_yn] = useState("");
  const [inventory, setInventory] = useState("");

  // 기존 정보 가져오기
  useEffect(() => {
    const fetchGoodsInfo = async () => {
      try {
        const response = await axios.get(`/api/goods/${no}`);
        const goodsData = response.data;
        console.log(response.data);
        setName(goodsData[0].goods.name);
        setPrice(goodsData[0].goods.price);
        setInventory(goodsData[0].goods.inventory);
        setContent(goodsData[0].goods.content);
        setSale_yn(goodsData[0].goods.sale_yn);
      } catch (error) {
				console.log("Error fetching goods info:", error);
			}
    };
    fetchGoodsInfo();
  }, [no]);


  // 수정 정보 저장 및 이미지 업로드
  const handleUpdateGoods = async (e) => {
    e.preventDefault();
    try {
      axios.put(`/api/goods/${no}`, {
        name: name,
        price: price,
        content: content,
        inventory: inventory,
        sale_yn: sale_yn,
        images_no: null
      });

      alert('상품 수정 완료');
      navigate('/goods');

    } catch(err) {
      console.log('상품 수정 에러  : ' + err);
      alert('상품 수정 실패');
    }
    
  };

  // handleCancel
  const handleCancel = () => {
    if(confirm("수정을 취소하시겠습니까?") === true) {
      return navigate('/goods');
    } else {
      return null;
    };
  };


  return (
    <section className='formSection'>
        <div className='infoBox'>
          <div className='goodsName'>
            <p> 제품명 </p>
            <input 
              type='text' 
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className='goodsPrice'>
            <p> 제품가격 </p>
            <input 
              type='number' 
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>

          <div className='goodsInventory'>
            <p> 제품수량 </p>
            <input
              type='number'
              value={inventory}
              onChange={(e) => setInventory(e.target.value)}
            />
          </div>

          <div className='goodsSaleYn'>
            <p> 판매상태 </p>
            <select value={sale_yn} onChange={(e) => setSale_yn(e.target.value)}>
              <option value="Y">판매가능</option>
              <option value="N">품절</option>
            </select>
          </div>

          <div className='goodsContent'>
            <p> 제품설명 </p>
            <textarea 
              type='text'
              value={content}
              className="content"
              onChange={(e) => setContent(e.target.value)}
            />
          </div>

          <div className="btnBox">
            <button className="submit" type="submit" onClick={handleUpdateGoods}> 수정하기 </button>
            <button className="cancel" type="button" onClick={handleCancel}> 취소 </button>
          </div>
        </div>

    </section>
  )
}

export default GoodsEditForm