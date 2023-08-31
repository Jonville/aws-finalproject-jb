import React from 'react'

import '../../styles/base/sub.css'
import '../../styles/base/bookclassStyle.css'

import PageVisual from "../../components/layout/PageVisual"
import BookclassApplyForm from './BookclassApplyForm'

const BookclassApplyPage = () => {

  // const [alreadyData, setAlreadyData] = useState(null);
  // const data = null;
  // setAlreadyData(data);
  // if (alreadyData) {
  //   confirm("이미 개설 신청한 북클래스가 있습니다. \n신청한 북클래스를 확인하시겠습니까?") ?
  //   null : null
  // } else {null}




  return (
    <main id="pageContainer" className="bookclass apply">
      <PageVisual/>

      {/* #pageContents --- START */}
      <div id="pageContents">
        <BookclassApplyForm />
      </div>
      {/* #pageContents --- END */}
    </main>
  )
}

export default BookclassApplyPage